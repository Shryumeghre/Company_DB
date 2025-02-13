package com.example;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileInputStream;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;

public class ExcelToMySQL {
    public static void main(String[] args) {
        String excelFilePath = "C://Users//shryu//Downloads//amazon_tx_data.xlsx";
        System.out.println("\uD83D\uDCC2 Reading Excel Data...");

        Connection connection = null;
        FileInputStream fis = null;
        Workbook workbook = null;

        try {
            connection = DatabaseUtil.getConnection();
            fis = new FileInputStream(new File(excelFilePath));
            workbook = new XSSFWorkbook(fis);
            System.out.println("✅ Connected to the database successfully!");

            Sheet sheet = workbook.getSheetAt(0);
            Map<Integer, String> categoryMap = new HashMap<>();
            Map<String, Integer> productMap = new HashMap<>();

            // Load existing categories into categoryMap
            Statement categorySelectStmt = connection.createStatement();
            ResultSet categoryRs = categorySelectStmt.executeQuery("SELECT category_id, category_name FROM category");
            while (categoryRs.next()) {
                categoryMap.put(categoryRs.getInt("category_id"), categoryRs.getString("category_name"));
            }
            categoryRs.close();
            categorySelectStmt.close();

            String insertCategorySQL = "INSERT IGNORE INTO category (category_id, category_name) VALUES (?, ?)";
            String insertProductSQL = "INSERT IGNORE INTO product (product_id, title, category_id, price) VALUES (?, ?, ?, ?)";
            String insertTransactionSQL = "INSERT IGNORE INTO transaction (txid, product_id, store, sales, commission, status, added_at, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            try (PreparedStatement categoryStmt = connection.prepareStatement(insertCategorySQL);
                 PreparedStatement productStmt = connection.prepareStatement(insertProductSQL);
                 PreparedStatement transactionStmt = connection.prepareStatement(insertTransactionSQL)) {

                connection.setAutoCommit(false);
                int rowCount = 0;
                SimpleDateFormat excelDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                for (Row row : sheet) {
                    if (row.getRowNum() == 0) continue; // Skip header

                    try {
                        String txid = getCellValue(row.getCell(0));
                        String store = getCellValue(row.getCell(1));
                        String productId = getCellValue(row.getCell(2));
                        String title = getCellValue(row.getCell(3));
                        int categoryId = extractCategoryId(row.getCell(4));
                        String categoryName = getCellValue(row.getCell(5));
                        double sales = getNumericCellValue(row.getCell(6));
                        double price = getNumericCellValue(row.getCell(7));
                        double commission = getNumericCellValue(row.getCell(8));
                        String status = getCellValue(row.getCell(12));
                        String addedAt = getDateCellValue(row.getCell(13), excelDateFormat);
                        String lastUpdated = getDateCellValue(row.getCell(14), excelDateFormat);

                        if (categoryId == 0 || categoryName.isEmpty()) {
                            System.out.println("⚠️ Skipping row " + row.getRowNum() + " due to missing category data.");
                            continue;
                        }

                        if (!categoryMap.containsKey(categoryId)) {
                            categoryStmt.setInt(1, categoryId);
                            categoryStmt.setString(2, categoryName);
                            categoryStmt.addBatch();
                            categoryMap.put(categoryId, categoryName);
                            System.out.println("✅ Inserted into category: " + categoryId + " - " + categoryName);
                        }

                        if (!productMap.containsKey(productId)) {
                            productStmt.setString(1, productId);
                            productStmt.setString(2, title);
                            productStmt.setInt(3, categoryId);
                            productStmt.setDouble(4, price);
                            productStmt.addBatch();
                            productMap.put(productId, categoryId);
                            System.out.println("✅ Inserted into product: " + productId + " (Category: " + categoryId + ")");
                        }

                        transactionStmt.setString(1, txid);
                        transactionStmt.setString(2, productId);
                        transactionStmt.setString(3, store);
                        transactionStmt.setDouble(4, sales);
                        transactionStmt.setDouble(5, commission);
                        transactionStmt.setString(6, status);
                        transactionStmt.setString(7, addedAt);
                        transactionStmt.setString(8, lastUpdated);
                        transactionStmt.addBatch();

                        rowCount++;
                    } catch (Exception rowError) {
                        System.out.println("⚠️ Skipping row " + row.getRowNum() + " due to error: " + rowError.getMessage());
                    }
                }

                categoryStmt.executeBatch();
                productStmt.executeBatch();
                transactionStmt.executeBatch();
                connection.commit();

                System.out.println("✅ Data Import Complete! " + rowCount + " rows inserted.");
            }
        } catch (SQLException sqlException) {
            System.out.println("❌ Database Error: " + sqlException.getMessage());
        } catch (Exception e) {
            System.out.println("❌ Unexpected Error: " + e.getMessage());
        } finally {
            closeResources(workbook, fis, connection);
        }
    }

    private static int extractCategoryId(Cell cell) {
        if (cell == null) return 0;
        try {
            return (cell.getCellType() == CellType.NUMERIC) ? (int) cell.getNumericCellValue() : Integer.parseInt(cell.getStringCellValue().trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private static String getCellValue(Cell cell) {
        return (cell == null) ? "" : cell.toString().trim();
    }

    private static double getNumericCellValue(Cell cell) {
        return (cell == null || cell.getCellType() != CellType.NUMERIC) ? 0.0 : cell.getNumericCellValue();
    }

    private static String getDateCellValue(Cell cell, SimpleDateFormat dateFormat) {
        if (cell == null) return null;
        return (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) ? dateFormat.format(cell.getDateCellValue()) : getCellValue(cell);
    }

    private static void closeResources(Workbook workbook, FileInputStream fis, Connection connection) {
        try { if (workbook != null) workbook.close(); if (fis != null) fis.close(); } catch (Exception e) {}
        try { if (connection != null) connection.close(); } catch (SQLException e) {}
        try { AbandonedConnectionCleanupThread.checkedShutdown(); } catch (Exception e) {}
    }
}
