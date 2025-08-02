import "./TermsOfService.css";

function TermsOfService() {
  return (
    <>
      <section className="terms-of-service">
        <h1>Terms of Service</h1>
        <p>Last updated: August 2, 2025</p>

        <strong>1. Acceptance of Terms</strong>
        <p>
          By accessing or using One-Music, accessible from{" "}
          <a className="a-tag"
            href="https://onemusic-qmq9.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://onemusic-qmq9.onrender.com/
          </a>
          , you agree to be bound by these Terms of Service, our{" "}
          <a className="a-tag"
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          , the{" "}
          <a className="a-tag"
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube Terms of Service
          </a>
          , and the{" "}
          <a className="a-tag"
            href="http://www.google.com/policies/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
          . If you do not agree, you must discontinue use of the Service.
        </p>

        <strong>2. Description of Service</strong>
        <p>
          One-Music provides features that integrate with third-party services,
          including but not limited to YouTube API Services. These integrations
          allow you to import, export, and manage music playlists and related
          content.
        </p>

        <strong>3. Use of YouTube API Services</strong>
        <p>
          By using One-Music, you acknowledge and agree that:
        </p>
        <ul>
          <li>
            Our application uses YouTube API Services to access and manage your
            YouTube data.
          </li>
          <li>
            You may revoke our access to your YouTube data at any time via your{" "}
            <a className="a-tag"
              href="https://security.google.com/settings/security/permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Security Settings
            </a>
            .
          </li>
          <li>
            All YouTube data access and usage will comply with the{" "}
            <a className="a-tag"
              href="https://developers.google.com/youtube/terms/developer-policies"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube API Services Developer Policies
            </a>
            .
          </li>
        </ul>

        <strong>4. Privacy</strong>
        <p>
          Your privacy is important to us. Our{" "}
          <a className="a-tag"
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{" "}
          explains what data we collect, how we use it, and your rights. It
          includes details about our use of YouTube API Services and your
          options for managing or deleting your data.
        </p>

        <strong>5. Intellectual Property</strong>
        <p>
          All content provided on One-Music, excluding content provided by
          users and third-party APIs, is owned by One-Music and protected by
          applicable copyright, trademark, and intellectual property laws.
        </p>

        <strong>6. Disclaimers</strong>
        <p>
          The Service is provided "as is" without warranties of any kind. We
          make no guarantees regarding accuracy, reliability, or availability.
          We are not responsible for any damages arising from your use of the
          Service.
        </p>

        <strong>7. Limitations of Liability</strong>
        <p>
          To the maximum extent permitted by law, One-Music and its affiliates
          will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits or data.
        </p>

        <strong>8. Modifications to the Terms</strong>
        <p>
          We reserve the right to update or modify these Terms at any time.
          Changes will be effective when posted on this page with an updated
          “Last updated” date. Your continued use of the Service after any
          changes constitutes acceptance of the new Terms.
        </p>

        <strong>9. Governing Law</strong>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Texas, United States, without regard to its
          conflict of law principles.
        </p>

        <strong>10. Contact Information</strong>
        <p>
          For any questions regarding these Terms, contact us at{" "}
          <a href="mailto:williamstevenson107@gmail.com" className="a-tag">
            williamstevenson107@gmail.com
          </a>
          .
        </p>
      </section>
    </>
  );
}

export default TermsOfService;
