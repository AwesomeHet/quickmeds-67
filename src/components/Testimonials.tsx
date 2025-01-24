import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Franchise Owner",
    content:
      "Joining QuickMeds was the best decision for my pharmacy career. The support and systems they provide are unmatched in the industry.",
  },
  {
    name: "Michael Chen",
    role: "Pharmacy Manager",
    content:
      "The inventory management system has revolutionized how we operate. We've seen a 40% increase in efficiency since implementing QuickMeds.",
  },
  {
    name: "Lisa Rodriguez",
    role: "Franchise Partner",
    content:
      "From day one, QuickMeds has provided exceptional support. Their training program and ongoing assistance have been invaluable.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          What Our Partners Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-white"
            >
              <CardContent className="pt-6">
                <div className="mb-4">
                  <svg
                    className="h-8 w-8 text-primary opacity-50"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-6">{testimonial.content}</p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-primary">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;