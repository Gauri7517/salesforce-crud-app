import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://salesforce-crud-backend-iwqw.onrender.com";

const OBJECT_CONFIG = {
  accounts: {
    label: "Account",
    pluralLabel: "Accounts",
    endpoint: "/salesforce/accounts",
    fields: [
      { key: "Name", label: "Account Name", type: "text" },
      { key: "Phone", label: "Phone", type: "text" },
      { key: "Website", label: "Website", type: "text" },
      { key: "Industry", label: "Industry", type: "text" },
      { key: "Type", label: "Type", type: "text" },
    ],
    displayFields: [
      "Name",
      "Phone",
      "Website",
      "Industry",
      "Type",
    ],
    createFields: [
      { key: "Name", label: "Account Name", type: "text" },
    ],
  },

  opportunities: {
    label: "Opportunity",
    pluralLabel: "Opportunities",
    endpoint: "/salesforce/opportunities",
    fields: [
      { key: "Name", label: "Opportunity Name", type: "text" },
      { key: "Amount", label: "Amount", type: "number" },
      { key: "StageName", label: "Stage", type: "text" },
      { key: "CloseDate", label: "Close Date", type: "date" },
      { key: "Type", label: "Type", type: "text" },
    ],
    displayFields: [
      "Name",
      "Amount",
      "StageName",
      "CloseDate",
      "Type",
    ],
    createFields: [
      { key: "Name", label: "Opportunity Name", type: "text" },
      { key: "Amount", label: "Amount", type: "number" },
      { key: "StageName", label: "Stage", type: "text" },
      { key: "CloseDate", label: "Close Date", type: "date" },
    ],
  },

  leads: {
    label: "Lead",
    pluralLabel: "Leads",
    endpoint: "/salesforce/leads",
    fields: [
      { key: "FirstName", label: "First Name", type: "text" },
      { key: "LastName", label: "Last Name", type: "text" },
      { key: "Company", label: "Company", type: "text" },
      { key: "Email", label: "Email", type: "email" },
      { key: "Phone", label: "Phone", type: "text" },
    ],
    displayFields: [
      "FirstName",
      "LastName",
      "Company",
      "Email",
      "Phone",
    ],
    createFields: [
      { key: "FirstName", label: "First Name", type: "text" },
      { key: "LastName", label: "Last Name", type: "text" },
      { key: "Company", label: "Company", type: "text" },
      { key: "Email", label: "Email", type: "email" },
      { key: "Phone", label: "Phone", type: "text" },
    ],
  },

  contacts: {
    label: "Contact",
    pluralLabel: "Contacts",
    endpoint: "/salesforce/contacts",
    fields: [
      { key: "FirstName", label: "First Name", type: "text" },
      { key: "LastName", label: "Last Name", type: "text" },
      { key: "Email", label: "Email", type: "email" },
      { key: "Phone", label: "Phone", type: "text" },
      { key: "Department", label: "Department", type: "text" },
    ],
    displayFields: [
      "FirstName",
      "LastName",
      "Email",
      "Phone",
      "Department",
    ],
    createFields: [
      { key: "FirstName", label: "First Name", type: "text" },
      { key: "LastName", label: "Last Name", type: "text" },
      { key: "Email", label: "Email", type: "email" },
      { key: "Phone", label: "Phone", type: "text" },
      { key: "Department", label: "Department", type: "text" },
    ],
  },

  cases: {
    label: "Case",
    pluralLabel: "Cases",
    endpoint: "/salesforce/cases",
    fields: [
      { key: "Subject", label: "Subject", type: "text" },
      { key: "Status", label: "Status", type: "text" },
      { key: "Priority", label: "Priority", type: "text" },
      { key: "Origin", label: "Origin", type: "text" },
      { key: "Type", label: "Type", type: "text" },
    ],
    displayFields: [
      "Subject",
      "Status",
      "Priority",
      "Origin",
      "Type",
    ],
    createFields: [
      { key: "Subject", label: "Subject", type: "text" },
      { key: "Status", label: "Status", type: "text" },
      { key: "Priority", label: "Priority", type: "text" },
      { key: "Origin", label: "Origin", type: "text" },
      { key: "Type", label: "Type", type: "text" },
    ],
  },
};

function App() {
  const [selectedObject, setSelectedObject] =
    useState("accounts");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [formData, setFormData] = useState({});

  const config = OBJECT_CONFIG[selectedObject];

  /* =========================
     LOGIN
  ========================= */

  const loginWithSalesforce = () => {
    window.location.href =
      `${API_URL}/oauth2/authorization/salesforce`;
  };

  /* =========================
     LOAD RECORDS
  ========================= */

  const loadRecords = async (
    objectKey = selectedObject,
    pageNumber = 0,
    append = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setMessage("");

      const objectConfig =
        OBJECT_CONFIG[objectKey];

      const response = await fetch(
        `${API_URL}${objectConfig.endpoint}?page=${pageNumber}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status}`
        );
      }

      const data = await response.json();

      const newRecords =
        data.records || [];

      if (append) {
        setRecords((previous) => [
          ...previous,
          ...newRecords,
        ]);
      } else {
        setRecords(newRecords);
      }

      setPage(pageNumber);

      setHasMore(
        newRecords.length === 20
      );
    } catch (error) {
      console.error(
        "Load records error:",
        error
      );

      setMessage(
        "Please login with Salesforce first."
      );

      if (!append) {
        setRecords([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /* =========================
     OBJECT CHANGE
  ========================= */

  const handleObjectChange = (event) => {
    const newObject =
      event.target.value;

    setSelectedObject(newObject);
    setRecords([]);
    setPage(0);
    setHasMore(true);
    setMessage("");
    setEditingRecord(null);
    setViewingRecord(null);
    setFormData({});

    loadRecords(
      newObject,
      0,
      false
    );
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadRecords(
      "accounts",
      0,
      false
    );
  }, []);

  /* =========================
     REFRESH
  ========================= */

  const refreshRecords = () => {
    setRecords([]);
    setPage(0);
    setHasMore(true);

    loadRecords(
      selectedObject,
      0,
      false
    );
  };

  /* =========================
     LOAD NEXT PAGE
  ========================= */

  const loadNextPage = () => {
    if (
      loading ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    loadRecords(
      selectedObject,
      page + 1,
      true
    );
  };

  /* =========================
     SCROLL
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight +
        window.scrollY;

      const pageHeight =
        document.documentElement
          .scrollHeight;

      if (
        scrollPosition >=
        pageHeight - 300
      ) {
        loadNextPage();
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [
    selectedObject,
    page,
    loading,
    loadingMore,
    hasMore,
  ]);

  /* =========================
     FORM CHANGE
  ========================= */

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     CREATE
  ========================= */

  const createRecord = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}${config.endpoint}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

      const result =
        await response.text();

      if (!response.ok) {
        throw new Error(result);
      }

      setMessage(
        `${config.label} created successfully!`
      );

      setFormData({});

      await loadRecords(
        selectedObject,
        0,
        false
      );
    } catch (error) {
      console.error(
        "Create error:",
        error
      );

      setMessage(
        "Create failed. Check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE
  ========================= */

  const updateRecord = async (event) => {
    event.preventDefault();

    if (!editingRecord) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}${config.endpoint}/${editingRecord.Id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

      const result =
        await response.text();

      if (!response.ok) {
        throw new Error(result);
      }

      setMessage(
        `${config.label} updated successfully!`
      );

      setEditingRecord(null);
      setFormData({});

      await loadRecords(
        selectedObject,
        0,
        false
      );
    } catch (error) {
      console.error(
        "Update error:",
        error
      );

      setMessage(
        "Update failed. Check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const editRecord = (record) => {
    setEditingRecord(record);

    const initialData = {};

    config.createFields.forEach(
      (field) => {
        initialData[field.key] =
          record[field.key] ?? "";
      }
    );

    setFormData(initialData);
    setViewingRecord(null);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     CANCEL EDIT
  ========================= */

  const cancelEdit = () => {
    setEditingRecord(null);
    setFormData({});
    setMessage("");
  };

  /* =========================
     VIEW
  ========================= */

  const viewRecord = (record) => {
    setViewingRecord(record);
  };

  /* =========================
     DELETE
  ========================= */

  const deleteRecord = async (id) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete this ${config.label}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}${config.endpoint}/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result =
        await response.text();

      if (!response.ok) {
        throw new Error(result);
      }

      /*
       * IMPORTANT:
       * Remove deleted record from
       * frontend state immediately.
       *
       * Because count uses:
       * records.length
       *
       * the count will decrease
       * immediately after delete.
       */

      setRecords((previous) =>
        previous.filter(
          (record) =>
            record.Id !== id
        )
      );

      setMessage(
        `${config.label} deleted successfully!`
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      setMessage(
        "Delete failed. Check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORMAT VALUE
  ========================= */

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return String(value);
  };

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div>
          <h1>
            Salesforce CRUD
          </h1>

          <p>
            Salesforce Object Management
            Dashboard
          </p>
        </div>

        <div className="header-actions">

          <button
            type="button"
            className="login-btn"
            onClick={
              loginWithSalesforce
            }
          >
            Login with Salesforce
          </button>

          <button
            type="button"
            className="refresh-btn"
            onClick={
              refreshRecords
            }
            disabled={loading}
          >
            Refresh
          </button>

        </div>

      </header>

      <main className="container">

        {/* =========================
            OBJECT SELECTOR
        ========================= */}

        <section className="form-card">

          <h2>
            Select Salesforce Object
          </h2>

          <select
            value={selectedObject}
            onChange={
              handleObjectChange
            }
            className="object-select"
          >

            <option value="accounts">
              Account
            </option>

            <option value="opportunities">
              Opportunity
            </option>

            <option value="leads">
              Lead
            </option>

            <option value="contacts">
              Contact
            </option>

            <option value="cases">
              Case
            </option>

          </select>

        </section>

        {/* =========================
            CREATE / UPDATE
        ========================= */}

        <section className="form-card">

          <h2>
            {editingRecord
              ? `Update ${config.label}`
              : `Create ${config.label}`}
          </h2>

          <form
            onSubmit={
              editingRecord
                ? updateRecord
                : createRecord
            }
          >

            {config.createFields.map(
              (field) => (

                <input
                  key={field.key}
                  type={field.type}
                  name={field.key}
                  placeholder={
                    field.label
                  }
                  value={
                    formData[
                      field.key
                    ] || ""
                  }
                  onChange={
                    handleFormChange
                  }
                />

              )
            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {editingRecord
                ? `Update ${config.label}`
                : `Add ${config.label}`}
            </button>

            {editingRecord && (
              <button
                type="button"
                className="cancel-btn"
                onClick={
                  cancelEdit
                }
              >
                Cancel
              </button>
            )}

          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

        </section>

        {/* =========================
            RECORDS
        ========================= */}

        <section className="accounts-card">

          <div className="section-header">

            <h2>
              Salesforce{" "}
              {config.pluralLabel}
            </h2>

            <span className="count">
              {records.length} Records
            </span>

          </div>

          {loading &&
            records.length === 0 && (
              <p className="loading">
                Loading...
              </p>
            )}

          {!loading &&
            records.length === 0 && (
              <p className="empty">
                No{" "}
                {config.pluralLabel.toLowerCase()}{" "}
                found.
              </p>
            )}

          {records.length > 0 && (
            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Salesforce ID
                    </th>

                    {config.displayFields.map(
                      (field) => {

                        const fieldConfig =
                          config.fields.find(
                            (item) =>
                              item.key ===
                              field
                          );

                        return (
                          <th
                            key={field}
                          >
                            {fieldConfig
                              ? fieldConfig.label
                              : field}
                          </th>
                        );
                      }
                    )}

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {records.map(
                    (
                      record,
                      index
                    ) => (

                      <tr
                        key={
                          record.Id
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {record.Id}
                        </td>

                        {config.displayFields.map(
                          (field) => (
                            <td
                              key={
                                field
                              }
                            >
                              {formatValue(
                                record[
                                  field
                                ]
                              )}
                            </td>
                          )
                        )}

                        <td>

                          <button
                            type="button"
                            className="view-btn"
                            onClick={() =>
                              viewRecord(
                                record
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              editRecord(
                                record
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deleteRecord(
                                record.Id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

          {loadingMore && (
            <p className="loading">
              Loading next 20 records...
            </p>
          )}

          {!loadingMore &&
            !hasMore &&
            records.length > 0 && (
              <p className="empty">
                All records loaded.
              </p>
            )}

        </section>

      </main>

      {/* =========================
          VIEW MODAL
      ========================= */}

      {viewingRecord && (

        <div
          className="modal-overlay"
          onClick={() =>
            setViewingRecord(null)
          }
        >

          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h2>
              {config.label} Details
            </h2>

            <div className="detail-row">

              <strong>
                Salesforce ID:
              </strong>

              <span>
                {formatValue(
                  viewingRecord.Id
                )}
              </span>

            </div>

            {config.fields.map(
              (field) => (

                <div
                  className="detail-row"
                  key={field.key}
                >

                  <strong>
                    {field.label}:
                  </strong>

                  <span>
                    {formatValue(
                      viewingRecord[
                        field.key
                      ]
                    )}
                  </span>

                </div>

              )
            )}

            <div className="modal-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setViewingRecord(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;