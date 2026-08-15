import { companyData } from '../../utils/data';

function CompanyLogo({ company }) {
  const handleError = (event) => {
    event.currentTarget.style.display = 'none';
    event.currentTarget.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <div className="company-mark" title={`${company.name} — ${company.role}`}>
      <div className="company-logo-frame" style={{ '--company-color': company.color }}>
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="company-logo-image"
            loading="lazy"
            onError={handleError}
          />
        ) : null}
        <span className={`${company.logoUrl ? 'hidden ' : ''}company-logo-fallback`} aria-hidden="true">
          {company.fallback}
        </span>
      </div>
      <div className="company-copy">
        <p className="company-name">{company.name}</p>
        <p className="company-role">{company.role}</p>
      </div>
    </div>
  );
}

export default function CompanyLogoStrip() {
  return (
    <section className="home-section company-section" aria-labelledby="companies-heading">
      <div className="section-kicker">WHERE I'VE WORKED</div>
      <h2 id="companies-heading" className="section-title compact-title">
        Experience across data, software & ML
      </h2>
      <div className="company-strip">
        {companyData.map((company) => (
          <CompanyLogo key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
