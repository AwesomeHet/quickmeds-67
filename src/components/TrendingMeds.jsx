import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trendingMeds = [
  {
    name: "Pain Relief Plus",
    category: "Pain Management",
    price: "$19.99",
    trend: "↑ 15%",
  },
  {
    name: "AllergyCare",
    category: "Allergy",
    price: "$24.99",
    trend: "↑ 12%",
  },
  {
    name: "VitaBoost",
    category: "Supplements",
    price: "$29.99",
    trend: "↑ 20%",
  },
];

const TrendingMeds = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Trending Medications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingMeds.map((med, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {med.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{med.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    {med.price}
                  </span>
                  <span className="text-green-500 font-medium">{med.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMeds;