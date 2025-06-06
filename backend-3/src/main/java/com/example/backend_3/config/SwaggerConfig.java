package com.example.backend_3.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
            .info(new Info()
                .title("IoT Backend API")
                .description("Documentation for backend-3 APIs")
                .version("1.0.0")
            );
    }

    // (Optional) Chỉ định group, paths cụ thể
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
            .group("iot")
            .pathsToMatch("/api/**")
            .build();
    }
}
