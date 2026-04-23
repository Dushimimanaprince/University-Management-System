package com.ecommerce.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String SECRET= "MySecurityKeyYouCan'tGuessAtAnyGivenTime1234.";
    private final long EXIPIRATION= 86400000;

    private Key getKey(){
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String userCode, String role){

        return Jwts.builder()
            .setSubject(userCode)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis()+EXIPIRATION))
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String getUserCode(String token){
        return Jwts.parserBuilder()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public String getUserRole(String token){

        return Jwts.parserBuilder()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("role",String.class);
    }

    public boolean isTokenValid(String token){

        try{
            Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token);
            return true;
                
        }catch (Exception e){
            return false;
        }
    }

    
}
