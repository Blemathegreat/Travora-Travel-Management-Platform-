import Rectangle from "./images/blog.png"
import Partnership from "./images/partnership.svg"
import Ellipse from "./images/Ellipse 7 (1).png"
import Ellipse1 from "./images/Ellipse 7 (2).png"
import Ellipse2 from "./images/Ellipse 7.png"
import Frame from "./images/Frame4.png"
import Frame1 from "./images/Frame1.png"
import Frame2 from "./images/Frame2.png"
import Frame3 from "./images/Frame3.png"
import Menu from "./images/menu_icon1.png"
import Background from "./images/image 13.png"
import Mask from "./images/Mask.png"
import Mask1 from "./images/Mask1.png"
import Megaphone from "./images/Megaphone.png"
import pexels1 from "./images/pexels1.svg"
import pexels2 from "./images/pexels2.svg"
import pexels3 from "./images/pexels3.svg"
import Dropdown from "./images/dropdown.png"
import pexels4 from "./images/pexels4.svg"
import Rectangle33 from "./images/Rectangle 33.png"
import Rectangle45 from "./images/Rectangle 45.svg"
import Testimonial from "./images/Testimonial.svg"
import logo from "./images/logo.png"
import { href } from "react-router-dom"

export const images = {
  logo: logo, 
  blog: Rectangle,
  ellipse: Ellipse,
  partnership: Partnership,
  dropdown:Dropdown,
  ellipse1: Ellipse1,
  menu: Menu,
  ellipse2: Ellipse2,
  background: Background,
  frame: Frame,
  frame1: Frame1,
  frame2: Frame2,
  frame3: Frame3,
  mask: Mask,
  mask1: Mask1,
  megaphone: Megaphone,
  pexels1,
  pexels2,
  pexels3,
  pexels4,
  rectangle33: Rectangle33,
  rectangle45: Rectangle45,
  testimonial: Testimonial,
}

export const navbar = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "About",
    href: "/about"
  },
  {
    label: "Service",
    href: "/service"
  },
  {
    label: "Blog",
    href: "/blog"
  },
  {
    label: "Contact",
    href: "/contact"
  },

  {
    label: "Partnership",
    href: "/partnership"
  },

]
export const question = [{
  image: Frame1,
  title: "Choose Your Service",
  description: "Not sure which travel or visa service fits your needs best?"
},
{
  image: Frame1,
  title: "Start Your Journey",
  description: "Curious about studying or relocating abroad and don't know where to start?"
},
{
  image: Frame1,
  title: "Get Expert Help",
  description: "Need help with documentation, scholarship applications, or travel planning?"
},
{
  image: Frame1,
  title: "Understand Our Process",
  description: "Looking for clarity on how our process works?"
}]
export const services = [{
  id:1,
  image: pexels4,
  title: "Visa Consultation & Application Support",
  description: "We guide you step-by-step for study, work, tourism, and permanent visa application including forms, interview prep.....",
  href: "/visa-consultation"
},
{
  id:2,
  image: pexels1,
  title: "Scholarship Assistance",
  description: "Get help identifying, applying for, and winning scholarships with tailored document support, essay editing, and deadline tracking. ...",
  href: "/scholarship-assistance"
},
{
  id:3,
  image: pexels3,
  title: "Flight Bookings & Airport Transfers",
  description: "Book affordable flights and reliable pickups across Ghana and abroad, including solo or group airport transfers.",
  href: "/flight-booking"
},
{
  id:4,
  image: pexels2,
  title: "Accommodation Services",
  description: "Find verified hostels, Airbnb, and short stays at your destination. We also provide tourism packages for visitors to Ghana.",
  href: "/accommodation"
},

{
  id:5,
  image: Testimonial,
  title: "Visa Consultation & Application Support",
  description: "We guide you step-by-step for study, work, tourism, and permanent visa application including forms, interview prep.....",
  href: "/visa-consultation"
},
{
  id:6,
  image: Testimonial,
  title: "Scholarship Assistance",
  description: "Get help identifying, applying for, and winning scholarships with tailored document support, essay editing, and deadline tracking. ...",
  href: "/scholarship-assistance"
},
{
  id:7,
  image: Testimonial,
  title: "Flight Bookings & Airport Transfers",
  description: "Book affordable flights and reliable pickups across Ghana and abroad, including solo or group airport transfers.",
  href: "/flight-booking"
},
{
  id:8,
  image: pexels2,
  title: "Accommodation Services",
  description: "Find verified hostels, Airbnb, and short stays at your destination. We also provide tourism packages for visitors to Ghana.",
  href: "/accommodation"
},
{
  id:9,
  image: pexels4,
  title: "Visa Consultation & Application Support",
  description: "We guide you step-by-step for study, work, tourism, and permanent visa application including forms, interview prep.....",
  href: "/visa-consultation"
},
{
  id:10,
  image: pexels1,
  title: "Scholarship Assistance",
  description: "Get help identifying, applying for, and winning scholarships with tailored document support, essay editing, and deadline tracking. ...",
  href: "/scholarship-assistance"
},
{
  id:11,
  image: pexels3,
  title: "Flight Bookings & Airport Transfers",
  description: "Book affordable flights and reliable pickups across Ghana and abroad, including solo or group airport transfers.",
  href: "/flight-booking"
},
{
  id:12,
  image: pexels2,
  title: "Accommodation Services",
  description: "Find verified hostels, Airbnb, and short stays at your destination. We also provide tourism packages for visitors to Ghana.",
  href: "/accommodation"
}]
  export const testimonials = [
    {
      id: 1,
      name: 'Sebastian',
      role: 'Lead Developer',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 2,
      name: 'Evangeline',
      role: 'Product Manager',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 3,
      name: 'Alexander',
      role: 'UI/UX Designer',
    image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 4,
      name: 'Victoria',
      role: 'Marketing Director',
     image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 5,
      name: 'Christopher',
      role: 'CEO',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 6,
      name: 'Isabella',
      role: 'Creative Director',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 7,
      name: 'Benjamin',
      role: 'Sales Manager',
     image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 8,
      name: 'Sophia',
      role: 'HR Specialist',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 9,
      name: 'Nicholas',
      role: 'Backend Engineer',
     image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 10,
      name: 'Olivia',
      role: 'Brand Strategist',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 11,
      name: 'Jonathan',
      role: 'Data Analyst',
      image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    },
    {
      id: 12,
      name: 'Charlotte',
      role: 'Content Writer',
     image: Testimonial,
      rating: 5,
      text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.'
    }
  ];
