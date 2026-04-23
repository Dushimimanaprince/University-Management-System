package com.ecommerce.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        http
            .cors(cors -> cors.configurationSource(request -> {
            var opt = new org.springframework.web.cors.CorsConfiguration();
            opt.setAllowedOrigins(java.util.List.of("http://localhost:5173")); 
            opt.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            opt.setAllowedHeaders(java.util.List.of("*"));
            opt.setAllowCredentials(true);
            return opt;
                }))
        
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()

            );
        
        return http.build();
    }
    
}
