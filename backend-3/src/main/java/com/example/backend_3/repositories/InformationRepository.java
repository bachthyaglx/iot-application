package com.example.backend_3.repositories;

import com.example.backend_3.models.Information;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InformationRepository extends JpaRepository<Information, Long> {}
