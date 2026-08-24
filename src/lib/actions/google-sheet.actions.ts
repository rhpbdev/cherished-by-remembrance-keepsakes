'use server';
import { google } from 'googleapis';

// Google Sheets API setup and authentication
const myProjectId = process.env.GOOGLE_SERVICE_PROJECT_ID || 'YOUR_PROJECT_ID';
const myClientEmail =
	process.env.GOOGLE_SERVICE_CLIENT_EMAIL || 'YOUR_CLIENT_EMAIL';
const myPrivateKey = process.env.GOOGLE_PRIVATE_KEY || 'YOUR_PRIVATE_KEY';
const myServiceAccountType =
	process.env.GOOGLE_SERVICE_ACCOUNT_TYPE || 'service_account';
const myPrivateKeyId =
	process.env.GOOGLE_SERVICE_PRIVATE_KEY_ID || 'YOUR_PRIVATE_KEY_ID';

export async function getSheetData() {
	const glAuth = await google.auth.getClient({
		projectId: myProjectId,
		credentials: {
			type: myServiceAccountType,
			project_id: myProjectId,
			private_key_id: myPrivateKeyId,
			private_key: myPrivateKey,
			client_email: myClientEmail,
			universe_domain: 'googleapis.com',
		},
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});

	const glSheets = google.sheets({ version: 'v4', auth: glAuth });

	const data = await glSheets.spreadsheets.values.get({
		spreadsheetId: process.env.GOOGLE_SHEET_ID!,
		range: 'A1:I1',
	});

	console.log(data.data.values);

	return { data: data.data.values };
}

export async function appendOrderToSheet() {
	const glAuth = await google.auth.getClient({
		projectId: myProjectId,
		credentials: {
			type: myServiceAccountType,
			project_id: myProjectId,
			private_key_id: myPrivateKeyId,
			private_key: myPrivateKey,
			client_email: myClientEmail,
			universe_domain: 'googleapis.com',
		},
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});

	const glSheets = google.sheets({ version: 'v4', auth: glAuth });

	// Dummy order data
	const dummyOrderData = [
		[
			'ORDER-' + Date.now(), // Order ID
			'John Doe', // Customer Name
			'john.doe@example.com', // Customer Email
			new Date().toLocaleString(), // Order Date
			'$125.00', // Total Amount
			'Stripe', // Payment Method
			'Paid', // Payment Status
			'123 Main St, New York, NY 10001, USA', // Shipping Address
			'Deluxe Trifold Program (x25) - $100.00', // Items
		],
	];

	const response = await glSheets.spreadsheets.values.append({
		spreadsheetId: process.env.GOOGLE_SHEET_ID!,
		range: 'Orders!A:I',
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: dummyOrderData,
		},
	});

	console.log('Appended order:', response.data);

	return { success: true, data: response.data };
}
