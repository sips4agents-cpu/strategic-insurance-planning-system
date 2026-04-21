"use client";

import { useParams } from "next/navigation";

const formOptions = [
  {
    label: "Form L564",
    value: "l564",
    url: "https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms-l564e.pdf",
  },
  {
    label: "Form Part B Enrollment",
    value: "partb",
    url: "https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms40b-e.pdf",
  },
  {
    label: "IRMAA link",
    value: "irmaa",
    url: "https://www.medicare.gov/publications/11579-medicare-costs.pdf",
  },
  {
    label: "HSA guideline link",
    value: "hsa",
    url: "https://www.irs.gov/publications/p969",
  },
  {
    label: "Quick rater tied to rate summary",
    value: "quickrater",
    url: "/rate-summary",
  },
];

export default function HouseholdDetailPage() {
  const params = useParams();
  const householdId = params?.id;

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Household Detail</h1>
      <p>Household ID: {householdId}</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "520px" }}>
        <select style={inputStyle} defaultValue="">
          <option value="" disabled>
            Select Form / Link
          </option>
          {formOptions.map((option) => (
            <option key={option.value} value={option.url}>
              {option.label}
            </option>
          ))}
        </select>

        <a href="/clients" style={linkStyle}>
          Return to Clients
        </a>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "12px",
  border: "1px solid #c9d1d9",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
};

const linkStyle = {
  padding: "12px 16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};
