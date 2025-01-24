import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const FranchiseSection = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form Submitted",
      description: "We'll get back to you soon!",
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Join the QuickMeds Family
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Become a part of the fastest-growing pharmacy franchise network.
              Benefit from our proven business model and comprehensive support
              system.
            </p>
            <ul className="space-y-4">
              {[
                "Comprehensive training and support",
                "Cutting-edge inventory management system",
                "Marketing and branding assistance",
                "Established supplier relationships",
              ].map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Request Franchise Information
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input placeholder="Full Name" required />
              </div>
              <div>
                <Input type="email" placeholder="Email Address" required />
              </div>
              <div>
                <Input placeholder="Phone Number" required />
              </div>
              <div>
                <Input placeholder="Location of Interest" required />
              </div>
              <div>
                <Textarea
                  placeholder="Tell us about your business experience"
                  className="h-32"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseSection;