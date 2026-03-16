package com.example.demo.config;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.client5.http.ssl.TrustAllStrategy;
import org.apache.hc.core5.ssl.SSLContexts;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;

@Configuration
public class RestConfig {

    @Bean
    public RestTemplate restTemplate() throws Exception {
        SSLContext sslContext = SSLContexts.custom()
                .loadTrustMaterial(null, TrustAllStrategy.INSTANCE)
                .build();

        SSLConnectionSocketFactory csf = SSLConnectionSocketFactoryBuilder.create()
                .setSslContext(sslContext)
                .build();

        HttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(csf)
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .evictExpiredConnections()
                .build();

        return new RestTemplate(new HttpComponentsClientHttpRequestFactory(httpClient));
    }
}
