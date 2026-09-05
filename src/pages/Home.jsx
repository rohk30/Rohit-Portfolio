import PageTransition from '../components/layout/PageTransition';
import CricketGroundHero from '../components/cricket/CricketGroundHero';

function Home() {
  return (
    <PageTransition className="portfolio-page" style={{ paddingTop: 0 }}>
      <CricketGroundHero />
    </PageTransition>
  );
}

export default Home;
