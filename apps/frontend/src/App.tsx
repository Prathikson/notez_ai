import FileUpload from './sections/FileUpload'; // Make sure the path is correct based on where you saved the FileUpload component
import Header from './components/Header';
import Footer from './components/Footer';
import PricingSection from './sections/PricingSection';

function App() {
  return (
  <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <FileUpload />
        <PricingSection/>
        {/* any other components */}
      </main>

      <Footer />
    </div>
  );
}

export default App;
