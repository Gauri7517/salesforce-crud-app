package com.gauri.salesforce_crud;

import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class SalesforceController {

    private final RestClient restClient = RestClient.create();

    private final String salesforceUrl =
            "https://orgfarm-b64f39409c-dev-ed.develop.my.salesforce.com";

    private final String apiVersion = "v66.0";


    // GET - Fetch all Accounts
    @GetMapping("/salesforce/accounts")
    public String getAccounts(
            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String accessToken =
                authorizedClient.getAccessToken().getTokenValue();

        String queryUrl =
                salesforceUrl
                + "/services/data/"
                + apiVersion
                + "/query?q=SELECT+Id,Name+FROM+Account";

        return restClient.get()
                .uri(queryUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(String.class);
    }


    // POST - Create Account
    @PostMapping("/salesforce/accounts")
    public String createAccount(
            @RequestBody AccountRequest request,
            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String accessToken =
                authorizedClient.getAccessToken().getTokenValue();

        String createUrl =
                salesforceUrl
                + "/services/data/"
                + apiVersion
                + "/sobjects/Account/";

        return restClient.post()
                .uri(createUrl)
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .body(request)
                .retrieve()
                .body(String.class);
    }


    // GET - Fetch Account by ID
    @GetMapping("/salesforce/accounts/{id}")
    public String getAccountById(
            @PathVariable String id,
            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String accessToken =
                authorizedClient.getAccessToken().getTokenValue();

        String queryUrl =
                salesforceUrl
                + "/services/data/"
                + apiVersion
                + "/query?q=SELECT+Id,Name+FROM+Account+WHERE+Id='"
                + id
                + "'";

        return restClient.get()
                .uri(queryUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(String.class);
    }


    // PUT - Update Account
    @PutMapping("/salesforce/accounts/{id}")
    public String updateAccount(
            @PathVariable String id,
            @RequestBody AccountRequest request,
            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String accessToken =
                authorizedClient.getAccessToken().getTokenValue();

        String updateUrl =
                salesforceUrl
                + "/services/data/"
                + apiVersion
                + "/sobjects/Account/"
                + id;

        restClient.patch()
                .uri(updateUrl)
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .body(request)
                .retrieve()
                .toBodilessEntity();

        return "Account updated successfully";
    }


    // DELETE - Delete Account
    @DeleteMapping("/salesforce/accounts/{id}")
    public String deleteAccount(
            @PathVariable String id,
            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String accessToken =
                authorizedClient.getAccessToken().getTokenValue();

        String deleteUrl =
                salesforceUrl
                + "/services/data/"
                + apiVersion
                + "/sobjects/Account/"
                + id;

        restClient.delete()
                .uri(deleteUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .toBodilessEntity();

        return "Account deleted successfully";
    }
}