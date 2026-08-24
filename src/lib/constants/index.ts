export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'CFMemories';
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	'Personalized memorial products with compassionate design tools and professional printing services';
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 8;
export const FEATURED_PRODUCTS_LIMIT =
	Number(process.env.FEATURED_PRODUCTS_LIMIT) || 8;
export const TAX_RATE = Number(process.env.TAX_RATE) || 0.1; // 10% default

// Sign-in form default values
export const signInDefaultValues = {
	email: '',
	password: '',
};

// Sign-up form default values
export const signUpDefaultValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

export const shippingAddressDefaultValues = {
	fullName: '',
	streetAddress: '',
	city: '',
	postalCode: '',
	country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(', ')
	: ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

// Payment method display labels (user-friendly names)
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
	PayPal: 'PayPal',
	Stripe: 'Debit / Credit Card',
	CashOnDelivery: 'Cash on Delivery',
};

// Helper function to get display label for payment method
export const getPaymentMethodLabel = (method: string): string => {
	return PAYMENT_METHOD_LABELS[method] || method;
};

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

// Default print quantities offered for a product/variant.
export const DEFAULT_ALLOWED_QUANTITIES = [25, 50, 75, 100, 150, 250, 500];

export const productDefaultValues = {
	name: '',
	slug: '',
	category: '',
	images: [],
	brand: '',
	description: '',
	price: '0',
	stock: 0,
	rating: '0',
	numReviews: '0',
	isFeatured: false,
	banner: null,
	height: '',
	width: '',
	options: [] as Array<{ name: string; values: string[] }>,
};

export const PRODUCT_SIZES = process.env.PRODUCT_SIZES
	? process.env.PRODUCT_SIZES.split(', ')
	: (['deluxe', 'legal', 'large', 'medium'] as const);

export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(', ')
	: (['user', 'admin'] as const);

export const reviewFormDefaultValues = {
	title: '',
	description: '',
	rating: 0,
};

export const designFormDefaultValues = {
	nameOfDeceased: '',
	dateOfBirth: '',
	dateOfDeath: '',
	height: '2550', // 8.5" at 300 DPI
	width: '3300', // 11" at 300 DPI
};

// Resend
export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
