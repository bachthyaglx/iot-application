package com.example.backend_3.config;

import com.example.backend_3.exception.OpenApiExportException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.net.URI;

@Component
public class OpenApiExporter {

    private static final Logger logger = LoggerFactory.getLogger(OpenApiExporter.class);

    @Value("${SERVER_URL}")
    private String serverUrl;  // KHÔNG ĐỂ STATIC!

    @EventListener(ApplicationReadyEvent.class)
    public void exportOpenApiDocs() {
        String baseUrl = serverUrl;
        String outputDir = "target/open_api";  // ✅ export to target/open_api

        File dir = new File(outputDir);
        if (!dir.exists() && !dir.mkdirs()) {
            logger.error("❌ Could not create directory: {}", outputDir);
            return;
        }

        try {
            downloadFile(baseUrl + "/v3/api-docs", outputDir + "/api-docs.json");
            downloadFile(baseUrl + "/v3/api-docs.yaml", outputDir + "/api-docs.yaml");
            logger.info("✅ OpenAPI JSON & YAML files saved successfully to {}", outputDir);
        } catch (OpenApiExportException e) {
            logger.error("❌ Failed to export OpenAPI files: {}", e.getMessage(), e);
        }
    }

    private void downloadFile(String fileURL, String destination) {
        try (InputStream in = URI.create(fileURL).toURL().openStream();
            FileOutputStream out = new FileOutputStream(destination)) {

            byte[] buffer = new byte[4096];
            int n;
            while ((n = in.read(buffer)) != -1) {
                out.write(buffer, 0, n);
            }

        } catch (IOException e) {
            if (e.getMessage().contains("403")) {
                logger.warn("⚠️ Cannot access {} – Swagger may be protected. Skipping export.", fileURL);
            } else {
                throw new OpenApiExportException("Failed to download file from: " + fileURL, e);
            }
        } catch (Exception e) {
            throw new OpenApiExportException("Failed to download file from: " + fileURL, e);
        }
    }
}
