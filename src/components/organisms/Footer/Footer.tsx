import Link from 'next/link';
import { NewsletterSignup } from './NewsletterSignup';
import { PromoInfoBlocks } from './PromoInfoBlocks';
import {
  Instagram,
  MessageCircle,
  Twitter,
  Facebook,
  Youtube,
  Mail,
} from 'lucide-react';

const footerLinks = {
  contact: [
    { label: 'Chat', href: '/contact/chat' },
    { label: 'Email Us', href: '/contact/email' },
    { label: 'Public Relations', href: '/contact/pr' },
  ],
  account: [
    { label: 'Join Pacsun Rewards', href: '/rewards' },
    { label: 'My Account', href: '/account' },
    { label: 'Customer Service', href: '/customer-service' },
    { label: 'Student Discount', href: '/student-discount' },
  ],
  shopping: [
    { label: 'Promotions & Discounts', href: '/promotions' },
  ],
  style: [
    { label: 'Style Guide', href: '/style-guide' },
    { label: 'Newsroom', href: '/newsroom' },
    { label: 'The Youth Report', href: '/youth-report' },
  ],
  company: [
    { label: 'About Pacsun', href: '/about' },
    { label: 'Store Locator', href: '/stores' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy & Cookie Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Affiliate Program', href: '/affiliate' },
    { label: 'Site Map', href: '/sitemap' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/pacsun', icon: Instagram },
    { label: 'TikTok', href: 'https://tiktok.com/@pacsun', icon: MessageCircle },
    { label: 'Twitter', href: 'https://twitter.com/pacsun', icon: Twitter },
    { label: 'Facebook', href: 'https://facebook.com/pacsun', icon: Facebook },
    { label: 'Pinterest', href: 'https://pinterest.com/pacsun', icon: Mail },
    { label: 'YouTube', href: 'https://youtube.com/pacsun', icon: Youtube },
    { label: 'Snapchat', href: 'https://snapchat.com/add/pacsun', icon: MessageCircle },
  ],
};

export function Footer() {
  return (
    <footer
      data-component="Footer"
      className="bg-gray-50 mt-auto"
    >
      <NewsletterSignup />
      <PromoInfoBlocks />
      
      <div
        data-component="Footer.Container"
        className="container mx-auto px-4 py-12"
      >
        <div
          data-component="Footer.Content"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8"
        >
          <div data-component="Footer.Column.Contact">
            <h3
              data-component="Footer.Title"
              className="font-semibold text-gray-900 mb-4 text-sm"
            >
              Contact Us
            </h3>
            <ul
              data-component="Footer.Links"
              className="space-y-2 text-sm text-gray-600"
            >
              {footerLinks.contact.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-component="Footer.Column.Account">
            <h3
              data-component="Footer.Title"
              className="font-semibold text-gray-900 mb-4 text-sm"
            >
              Account Services
            </h3>
            <ul
              data-component="Footer.Links"
              className="space-y-2 text-sm text-gray-600"
            >
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-component="Footer.Column.Shopping">
            <h3
              data-component="Footer.Title"
              className="font-semibold text-gray-900 mb-4 text-sm"
            >
              Shopping Guide
            </h3>
            <ul
              data-component="Footer.Links"
              className="space-y-2 text-sm text-gray-600"
            >
              {footerLinks.shopping.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-component="Footer.Column.Style">
            <h3
              data-component="Footer.Title"
              className="font-semibold text-gray-900 mb-4 text-sm"
            >
              Style Guide & News
            </h3>
            <ul
              data-component="Footer.Links"
              className="space-y-2 text-sm text-gray-600"
            >
              {footerLinks.style.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-component="Footer.Column.Company">
            <h3
              data-component="Footer.Title"
              className="font-semibold text-gray-900 mb-4 text-sm"
            >
              Company
            </h3>
            <ul
              data-component="Footer.Links"
              className="space-y-2 text-sm text-gray-600"
            >
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-component="Footer.Column.Social">
            <h3
              data-component="Footer.Title"
              className="font-semibold text-gray-900 mb-4 text-sm"
            >
              Social
            </h3>
            <ul
              data-component="Footer.SocialLinks"
              className="space-y-2 text-sm text-gray-600"
            >
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          data-component="Footer.Copyright"
          className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600"
        >
          <p>© 2024 PacSun MVP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

