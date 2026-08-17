package com.gauri.salesforce_crud;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class SalesforceController {

    private final RestClient restClient = RestClient.create();

    private final String salesforceUrl =
            "https://orgfarm-b64f39409c-dev-ed.develop.my.salesforce.com";

    private final String apiVersion = "v66.0";

    /*
     * ============================================================
     * ALLOWED SALESFORCE OBJECTS + FIELDS
     * ============================================================
     */

    private static final Map<String, List<String>> OBJECT_FIELDS =
            new LinkedHashMap<>();

    static {
        OBJECT_FIELDS.put(
                "accounts",
                List.of(
                        "Id",
                        "Name",
                        "Industry",
                        "Phone",
                        "Website"
                )
        );

        OBJECT_FIELDS.put(
                "opportunities",
                List.of(
                        "Id",
                        "Name",
                        "Amount",
                        "StageName",
                        "CloseDate"
                )
        );

        OBJECT_FIELDS.put(
                "leads",
                List.of(
                        "Id",
                        "FirstName",
                        "LastName",
                        "Company",
                        "Email",
                        "Phone"
                )
        );

        OBJECT_FIELDS.put(
                "contacts",
                List.of(
                        "Id",
                        "FirstName",
                        "LastName",
                        "Email",
                        "Phone",
                        "AccountId"
                )
        );

        OBJECT_FIELDS.put(
                "cases",
                List.of(
                        "Id",
                        "CaseNumber",
                        "Subject",
                        "Status",
                        "Priority",
                        "Origin"
                )
        );
    }

    /*
     * Convert frontend object name to Salesforce API object name
     */
    private String getSalesforceObject(String object) {

        return switch (object.toLowerCase()) {

            case "accounts" -> "Account";

            case "opportunities" -> "Opportunity";

            case "leads" -> "Lead";

            case "contacts" -> "Contact";

            case "cases" -> "Case";

            default -> throw new IllegalArgumentException(
                    "Unsupported Salesforce object: " + object
            );
        };
    }

    /*
     * Get fields for selected object
     */
    private List<String> getFields(String object) {

        List<String> fields =
                OBJECT_FIELDS.get(object.toLowerCase());

        if (fields == null) {
            throw new IllegalArgumentException(
                    "Unsupported Salesforce object: " + object
            );
        }

        return fields;
    }

    /*
     * Get access token
     */
    private String getAccessToken(
            OAuth2AuthorizedClient authorizedClient) {

        return authorizedClient
                .getAccessToken()
                .getTokenValue();
    }

    /*
     * ============================================================
     * GET OBJECT FIELDS
     *
     * Example:
     * GET /salesforce/accounts/fields
     * GET /salesforce/opportunities/fields
     * ============================================================
     */

    @GetMapping("/salesforce/{object}/fields")
    public List<String> getObjectFields(
            @PathVariable String object) {

        return getFields(object);
    }

    /*
     * ============================================================
     * GET RECORDS
     *
     * 20 records at a time
     *
     * Example:
     *
     * /salesforce/accounts?page=0
     * /salesforce/accounts?page=1
     *
     * ============================================================
     */

    @GetMapping("/salesforce/{object}")
    public String getRecords(
            @PathVariable String object,

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String salesforceObject =
                getSalesforceObject(object);

        List<String> fields =
                getFields(object);

        String fieldQuery =
                String.join(",", fields);

        int offset = page * 20;

        String soql =
                "SELECT "
                        + fieldQuery
                        + " FROM "
                        + salesforceObject
                        + " LIMIT 20"
                        + " OFFSET "
                        + offset;

        String queryUrl =
                salesforceUrl
                        + "/services/data/"
                        + apiVersion
                        + "/query?q="
                        + soql.replace(" ", "+");

        String accessToken =
                getAccessToken(authorizedClient);

        return restClient.get()
                .uri(queryUrl)
                .header(
                        "Authorization",
                        "Bearer " + accessToken
                )
                .retrieve()
                .body(String.class);
    }

    /*
     * ============================================================
     * GET SINGLE RECORD
     *
     * Example:
     * GET /salesforce/accounts/001xxxxxxxxxxxx
     * ============================================================
     */

    @GetMapping("/salesforce/{object}/{id}")
    public String getRecordById(
            @PathVariable String object,
            @PathVariable String id,

            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String salesforceObject =
                getSalesforceObject(object);

        List<String> fields =
                getFields(object);

        String fieldQuery =
                String.join(",", fields);

        String query =
                "SELECT "
                        + fieldQuery
                        + " FROM "
                        + salesforceObject
                        + " WHERE Id='"
                        + id
                        + "'";

        String queryUrl =
                salesforceUrl
                        + "/services/data/"
                        + apiVersion
                        + "/query?q="
                        + query.replace(" ", "+");

        String accessToken =
                getAccessToken(authorizedClient);

        return restClient.get()
                .uri(queryUrl)
                .header(
                        "Authorization",
                        "Bearer " + accessToken
                )
                .retrieve()
                .body(String.class);
    }

    /*
     * ============================================================
     * CREATE RECORD
     *
     * Example:
     *
     * POST /salesforce/accounts
     *
     * {
     *   "Name": "Gauri Company",
     *   "Industry": "Technology",
     *   "Phone": "9999999999"
     * }
     *
     * ============================================================
     */

    @PostMapping("/salesforce/{object}")
    public String createRecord(
            @PathVariable String object,

            @RequestBody Map<String, Object> request,

            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String salesforceObject =
                getSalesforceObject(object);

        String createUrl =
                salesforceUrl
                        + "/services/data/"
                        + apiVersion
                        + "/sobjects/"
                        + salesforceObject
                        + "/";

        String accessToken =
                getAccessToken(authorizedClient);

        return restClient.post()
                .uri(createUrl)
                .header(
                        "Authorization",
                        "Bearer " + accessToken
                )
                .header(
                        "Content-Type",
                        "application/json"
                )
                .body(request)
                .retrieve()
                .body(String.class);
    }

    /*
     * ============================================================
     * UPDATE RECORD
     *
     * PUT /salesforce/accounts/{id}
     * PUT /salesforce/opportunities/{id}
     * etc.
     * ============================================================
     */

    @PutMapping("/salesforce/{object}/{id}")
    public String updateRecord(
            @PathVariable String object,

            @PathVariable String id,

            @RequestBody Map<String, Object> request,

            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String salesforceObject =
                getSalesforceObject(object);

        String updateUrl =
                salesforceUrl
                        + "/services/data/"
                        + apiVersion
                        + "/sobjects/"
                        + salesforceObject
                        + "/"
                        + id;

        String accessToken =
                getAccessToken(authorizedClient);

        restClient.patch()
                .uri(updateUrl)
                .header(
                        "Authorization",
                        "Bearer " + accessToken
                )
                .header(
                        "Content-Type",
                        "application/json"
                )
                .body(request)
                .retrieve()
                .toBodilessEntity();

        return salesforceObject
                + " updated successfully";
    }

    /*
     * ============================================================
     * DELETE RECORD
     *
     * DELETE /salesforce/accounts/{id}
     * DELETE /salesforce/leads/{id}
     * etc.
     * ============================================================
     */

    @DeleteMapping("/salesforce/{object}/{id}")
    public String deleteRecord(
            @PathVariable String object,

            @PathVariable String id,

            @RegisteredOAuth2AuthorizedClient("salesforce")
            OAuth2AuthorizedClient authorizedClient) {

        String salesforceObject =
                getSalesforceObject(object);

        String deleteUrl =
                salesforceUrl
                        + "/services/data/"
                        + apiVersion
                        + "/sobjects/"
                        + salesforceObject
                        + "/"
                        + id;

        String accessToken =
                getAccessToken(authorizedClient);

        restClient.delete()
                .uri(deleteUrl)
                .header(
                        "Authorization",
                        "Bearer " + accessToken
                )
                .retrieve()
                .toBodilessEntity();

        return salesforceObject
                + " deleted successfully";
    }
}