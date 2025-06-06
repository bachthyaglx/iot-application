package com.example.backend_3.repositories;

import com.example.backend_3.models.Picture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PictureRepository extends JpaRepository<Picture, Long> {}
