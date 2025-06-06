package com.example.backend_3.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Information {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deviceClass;
    private String manufacturer;
    private String manufacturerUri;
    private String model;
    private Integer productCode;
    private String hardwareRevision;
    private String softwareRevision;
    private String serialNumber;
    private String productInstanceUri;
    private String webshopUri;
    private String sysDescr;
    private String sysName;
    private String sysContact;
    private String sysLocation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
