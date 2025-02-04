import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-blue-500 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl animate-fadeIn">
          <h1 className="text-5xl font-bold mb-6">
            Your Trusted Partner in Healthcare Solutions
          </h1>
          <p className="text-xl mb-8">
            Join QuickMeds in revolutionizing the pharmacy industry with our
            innovative franchise model and cutting-edge inventory management.
          </p>
          <div className="space-x-4">
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              size="lg"
            >
              Explore Franchise
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;