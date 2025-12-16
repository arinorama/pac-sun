'use client';

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreferenceChange = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement newsletter signup API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for signing up!');
      setEmail('');
      setMobile('');
      setPreferences([]);
    }, 1000);
  };

  return (
    <section
      data-component="NewsletterSignup"
      className="w-full bg-black text-white py-12"
    >
      <div
        data-component="NewsletterSignup.Container"
        className="container mx-auto px-4"
      >
        <div
          data-component="NewsletterSignup.Header"
          className="text-center mb-8"
        >
          <h2
            data-component="NewsletterSignup.Title"
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            Discounts. Free shipping. Drop alerts.
          </h2>
          <p
            data-component="NewsletterSignup.Subtitle"
            className="text-base md:text-lg text-gray-300"
          >
            Get first dibs on everything when you sign up.
          </p>
        </div>

        <form
          data-component="NewsletterSignup.Form"
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
        >
          <div
            data-component="NewsletterSignup.Inputs"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <div data-component="NewsletterSignup.EmailWrapper" className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                data-component="NewsletterSignup.Email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            <div data-component="NewsletterSignup.MobileWrapper" className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                data-component="NewsletterSignup.Mobile"
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div
            data-component="NewsletterSignup.Preferences"
            className="mb-6"
          >
            <p
              data-component="NewsletterSignup.PreferencesLabel"
              className="text-sm font-semibold mb-3"
            >
              Check all that apply:
            </p>
            <div
              data-component="NewsletterSignup.Checkboxes"
              className="flex flex-wrap gap-4"
            >
              {['Women', 'Men', 'Unisex', 'Kids'].map((pref) => (
                <label
                  key={pref}
                  data-component={`NewsletterSignup.Checkbox.${pref}`}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={preferences.includes(pref)}
                    onChange={() => handlePreferenceChange(pref)}
                    className="w-4 h-4 mr-2 accent-white"
                  />
                  <span className="text-sm">{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div
            data-component="NewsletterSignup.Legal"
            className="text-xs text-gray-400 mb-6 space-y-2"
          >
            <p>
              I understand that by providing my email address and/or mobile phone
              number and clicking "SIGN UP," I am opting-in to financial incentives
              by Pacsun. For more information about our financial incentive programs,
              including material terms, please visit our{' '}
              <a href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </a>
              .
            </p>
            <p>
              By signing up, you agree to receive recurring automated promotional and
              personalized marketing text messages (e.g. cart reminders) from Pacsun
              at the call number used when signing up. Consent is not a condition of
              any purchase. Reply HELP for help and STOP to cancel. Msg frequency
              varies. Msg & data rates may apply. To access and retain a record of
              your consent click 'Print' or 'Save' on your computer. Visit{' '}
              <a href="/terms" className="underline hover:text-white">
                Electronic Signatures in Global and National Commerce Act
              </a>
              ,{' '}
              <a href="/terms" className="underline hover:text-white">
                Messaging Terms & Conditions
              </a>
              ,{' '}
              <a href="/terms" className="underline hover:text-white">
                Terms of Use
              </a>
              , and{' '}
              <a href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </a>{' '}
              for more details.
            </p>
          </div>

          <Button
            data-component="NewsletterSignup.Submit"
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className="bg-white text-black hover:bg-gray-200"
          >
            {isSubmitting ? 'Signing up...' : 'SIGN UP'}
          </Button>
        </form>
      </div>
    </section>
  );
}

