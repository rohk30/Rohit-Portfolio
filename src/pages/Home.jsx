import PageTransition from '../components/layout/PageTransition';
import CricketGroundHero from '../components/cricket/CricketGroundHero';

function Home() {
  return (
    <PageTransition className="portfolio-page">
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <CricketGroundHero />
      </div>
    </PageTransition>
  );
}

export default Home;
