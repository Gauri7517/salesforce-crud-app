package com.gauri.salesforce_crud;

import java.util.Map;

import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class SalesforceController {

    private final RestClient restClient = RestClient.create();

    @GetMapping("/salesforce/accounts")
    public String getAccounts(
            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String accessToken =
                authorizedClient.getAccessToken().getTokenValue();

        String salesforceUrl =
                "https://orgfarm-b64f39409c-dev-ed.develop.my.salesforce.com";

        String queryUrl =
                salesforceUrl
                + "/services/data/v66.0/query?q=SELECT+Id,Name+FROM+Account";

        return restClient.get()
                .uri(queryUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(String.class);
    }
}