import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Stethoscope, 
  Star, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Video,
  Award,
  Mail,
  Brain
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ContactDoctorPage({ user }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationType, setConsultationType] = useState('video');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const doctors = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'Endocrinologist',
      rating: 4.9,
      reviews: 234,
      experience: 15,
      location: 'Mumbai, Maharashtra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      available: true,
      fee: 1500
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Diabetes Specialist',
      rating: 4.8,
      reviews: 189,
      experience: 12,
      location: 'Navi Mumbai, Maharashtra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
      available: true,
      fee: 1200
    },
    {
      id: '3',
      name: 'Dr. Anjali Desai',
      specialty: 'Nutritionist & Diabetes Educator',
      rating: 4.9,
      reviews: 312,
      experience: 10,
      location: 'Thane, Maharashtra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali',
      available: false,
      fee: 1000
    },
    {
      id: '4',
      name: 'Dr. Vikram Mehta',
      specialty: 'Endocrinologist',
      rating: 4.7,
      reviews: 156,
      experience: 18,
      location: 'Mumbai, Maharashtra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
      available: true,
      fee: 1800
    },
    {
      id: '5',
      name: 'Dr. Neha Verma',
      specialty: 'Diabetes & Lifestyle Coach',
      rating: 4.9,
      reviews: 278,
      experience: 8,
      location: 'Pune, Maharashtra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha',
      available: true,
      fee: 1100
    },
    {
      id: '6',
      name: 'Dr. Arjun Kapoor',
      specialty: 'Clinical Psychologist',
      rating: 4.8,
      reviews: 195,
      experience: 12,
      location: 'Mumbai, Maharashtra',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
      available: true,
      fee: 1400
    },
    {
      id: '7',
      name: 'Dr. Meera Patel',
      specialty: 'Mental Health Therapist',
      rating: 4.9,
      reviews: 267,
      experience: 14,
      location: 'Andheri, Mumbai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
      available: true,
      fee: 1300
    },
    {
      id: '8',
      name: 'Dr. Sameer Joshi',
      specialty: 'Psychiatrist & Stress Management',
      rating: 4.7,
      reviews: 178,
      experience: 16,
      location: 'Bandra, Mumbai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sameer',
      available: true,
      fee: 1600
    },
  ];

  const handleBookConsultation = (e) => {
    e.preventDefault();
    if (selectedDoctor) {
      toast.success(`Consultation booked with ${selectedDoctor.name}!`);
      setSelectedDoctor(null);
      setMessage('');
      setDate('');
      setTime('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mb-2">Connect with Healthcare Experts</h2>
          <p className="text-gray-600">
            Book video consultations or chat with specialized doctors and health experts
          </p>
        </div>

        {user.riskScore !== undefined && (
          <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200 shadow-xl">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                user.riskScore < 25 ? 'bg-green-500' :
                user.riskScore < 50 ? 'bg-yellow-500' :
                user.riskScore < 75 ? 'bg-orange-500' :
                'bg-red-500'
              }`}>
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Based on Your Risk Score</h4>
                <p className="text-gray-600">
                  {user.riskScore < 25 && 'Maintain your health with regular check-ups. Consider consulting a nutritionist for optimal wellness.'}
                  {user.riskScore >= 25 && user.riskScore < 50 && 'We recommend scheduling a consultation with a diabetes specialist to discuss prevention strategies.'}
                  {user.riskScore >= 50 && user.riskScore < 75 && 'It\'s important to consult with an endocrinologist soon. Early intervention can make a significant difference.'}
                  {user.riskScore >= 75 && 'We strongly recommend booking an urgent consultation with a diabetes specialist for comprehensive evaluation.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Doctors List */}
        <div className="space-y-6">
          <h3>Available Specialists</h3>
          
          <div className="grid gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Info */}
                  <div className="flex gap-4 flex-1">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="mb-1">{doctor.name}</h4>
                              {(doctor.specialty.includes('Psychologist') || doctor.specialty.includes('Therapist') || doctor.specialty.includes('Psychiatrist')) && (
                                <Brain className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <p className="text-gray-600">{doctor.specialty}</p>
                          </div>
                          {doctor.available ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Available</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Busy</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Consultation fee:</span>
                        <span className="text-lg">₹{doctor.fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:w-48">
                    <Button
                      onClick={() => setSelectedDoctor(doctor)}
                      disabled={!doctor.available}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Modal/Form */}
        {selectedDoctor && (
          <Card className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2">Book Consultation</h3>
                  <p className="text-gray-600">with {selectedDoctor.name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedDoctor(null)}
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleBookConsultation} className="space-y-6">
                {/* Consultation Type */}
                <div className="space-y-3">
                  <Label>Consultation Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setConsultationType('video')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        consultationType === 'video'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Video className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p>Video Call</p>
                      <p className="text-sm text-gray-500">₹{selectedDoctor.fee}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('message')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        consultationType === 'message'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p>Messaging</p>
                      <p className="text-sm text-gray-500">₹{Math.round(selectedDoctor.fee * 0.6)}</p>
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your concerns or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Contact Info */}
                <Card className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Contact Information:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </Card>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDoctor(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-lg"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {selectedDoctor && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedDoctor(null)}
          />
        )}
      </div>
    </div>
  );
}
