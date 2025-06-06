package com.example.backend_3.controllers;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/api")
@Tag(name = "Picture")
public class PictureController {

    @GetMapping("/picture")
    public ResponseEntity<byte[]> getImage() throws IOException {
        Resource imgFile = new ClassPathResource("static/image/device-3.jpg");

        byte[] imageBytes = Files.readAllBytes(imgFile.getFile().toPath());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }
}
