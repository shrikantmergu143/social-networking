import capitalize from '../helpers/capitalize';

const SUCCESS = {
  DEFAULT: 'Your request is successfully executed',
  FILE_UPLOADED: (file: string) => `${file} Uploaded Successfully`,
  FILE_UPDATED: (file: string) => `${file} Updated Successfully`,
  SIGN_UP: 'Signup Successful',
  LOGIN: 'Login Successful',
  LOGOUT: 'Logout Successful',
  PROFILE_DELETED: 'Profile Delete Successful',
  RECORD_CREATED: (record: string) => `${record} created Successfully`,
  RECORD_UPDATED: (record: string) => `${record} Updated Successfully`,
  RECORD_DELETED: (record: string) => `${record} Deleted Successfully`,
  RECORD_FOUND: (record: string) => `${record} Found Successfully`,
  RECORD_NOT_FOUND: (record: string) => `${record} Not Found`,
  OTP_VERIFIED: 'Your OTP has been successfully verified.',
  COMPLETE_VERIFICATION: (type: string) =>
    `OTP Sent to your contact, Please complete ${type} OTP verification`,
  COMPLETE_EMAIL_VERIFICATION: (type: string) =>
    `OTP Sent to your email, Please complete ${type} OTP verification`,
  OTP_EXPIRED: (type: string) =>
    `OTP for ${type} expired. we have sent new otp.`,
  ADDED_CREATED: (record: string) => `${record} Added Successfully`,
  CONFIRMATION_PENDING:
    "Your request has been sent to KAS team, we'll send you an update for login",
  USER_BLOCKED: 'Account has been blocked from admin',
  USER_REJECTED: 'User is rejected by Admin',
  STATUS_UPDATED: (text: string, status: string) =>
    `${capitalize(text)} ${capitalize(status)} Successfully`,
  ADD_TO_WISHLIST: 'Product Added To Wishlist.',
  REMOVE_FROM_WISHLIST: 'Product Removed From Wishlist.',
  ADD_TO_CART: 'Product Added To Cart.',
  REMOVE_FROM_CART: 'Product Removed From Cart.',
  BRAND_ADDED: 'Suppliers added to Brand Partners',
  BARCODE_VERIFIED: (barcode: string) =>
    `Barcode ${barcode} verified successfully.`,
  INVENTORY_FOUND: (barcode: string) =>
    `Earlier expiring inventory found (${barcode}) for the same product as the scanned barcode.`,
  ORDER_CANCELLED_SUCCESSFULLY: 'Your order has been successfully canceled.',
  ORDER_ALREADY_DELIVERED: 'The order has been previously delivered.',
  ORDER_ALREADY_ASSIGNED: 'Order already assigned',
  EMAIL_SENT: 'Your email has been sent successfully.',
  ORDER_CREATE_NOTIFICATION_TITLE: 'Order Placed Successfully!',
  ORDER_CREATE_NOTIFICATION_TEXT: (order: string) =>
    `Your order #${order} has been successfully placed. Thank you for choosing KAS Food. You will receive updates on the status of your order soon.`,
  ORDER_ASSIGNED_NOTIFICATION_TITLE: 'New Delivery Assignment',
  ORDER_ASSIGNED_NOTIFICATION_TEXT: (order: string) =>
    `You have been assigned a new delivery order #${order}. Please check your order list for details. Thank you for your service!`,
  ORDER_DELIVERED_NOTIFICATION_TITLE:
    'Your order has been successfully delivered.',
  ORDER_DELIVERED_NOTIFICATION_TEXT: (order: string) =>
    `Your order #${order} has been successfully delivered. Enjoy your purchase, and thank you for choosing KAS Food!`,
  ORDER_CANCELLED_NOTIFICATION_TITLE: 'Order Cancelled',
  ORDER_CANCELLED_NOTIFICATION_TEXT: (order: string) =>
    `Your order #${order} has been cancelled. If you have any questions, please contact our support team. We’re happy to assist you!`,
  REPORT_EXPORTED: 'Report exported successfully.',
  TICKET_CREATE_NOTIFICATION_TITLE: (ticketNo: string) =>
    `New Ticket Raised #${ticketNo}`,
  TICKET_CREATE_NOTIFICATION_TEXT: (orderNo: string) =>
    `New Ticket Raised Against Order #${orderNo}`,
  TICKET_RESOLVED_NOTIFICATION_TITLE: (ticketNo: string) =>
    `Your Ticket Resolved #${ticketNo}`,
  TICKET_RESOLVED_NOTIFICATION_TEXT: (orderNo: string) =>
    `Important Update Regarding Your Ticket Against Order No #${orderNo}`,
  ORDER_PICKED_UP: 'Order Picked Up Successfully',
  ORDER_PARTIALLY_PICKED_UP: 'Order Partially Picked Up Successfully',
  PRODUCT_IS_RE_STOCKED: 'Your Wishlist Item is Back in Stock!',
  PRODUCT_IS_RE_STOCKED_TEXT: (name: string) =>
    `${name} is available again! Order now before it sells out!`,
  INQUIRY: 'Your Inquiry has been submitted',
};

const ERROR = {
  METHOD_NOT_ALLOWED: 'An error occurred. Please try again.',
  COMPLETE_PROFILE: 'Please complete your profile.',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  BAD_SYNTAX: 'Invalid request syntax detected.',
  INVALID_PARAMETERS: 'The parameters provided are incorrect.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  UNAUTHENTICATED: 'Please log in to access.',
  TOO_MANY_REQUESTS:
    'You have reached the limit. Please try again after sometime.',
  VALIDATION: 'Validation Error!',
  PASSWORD_COMPARE: `Mismatch between password and confirmation field.`,
  EMAIL_PASSWORD_WRONG: `Authentication failed due to incorrect credentials.`,
  OLD_PASSWORD_NOT_MATCH: `Current Password Doesn't Matched!`,
  OLD_PASSWORD_COMPARE: `New Password is Same as Old Password!`,
  WRONG_CREDENTIALS: 'Wrong Credentials.',
  INCORRECT_OTP: 'Incorrect OTP, Please try again!.',
  ALREADY_EXISTS: (text: string) => `${text} already exist`,
  REVIEW_ALREADY_EXIST:
    'You have already given a review for this order, so you cannot add more than one review.',
  ALREADY_SUBSCRIBE: 'You Have Already Subscribed Our Newsletter',
  CONTACT_ALREADY_EXISTS: (text: string) =>
    `${text} already exist, You Can't Add More Than One ${text}`,
  EMAIL_EXIST: (text: string) => `${text} Email Address already exist`,
  CONTACT_EMAIL_EXIST: (user: string, data: string) =>
    `${user} With this ${data} already exist`,
  OTP_NOT_VERIFIED: 'OTP is not verified',
  OTP_EXPIRED: 'OTP Expired',
  FILE_TOO_LARGE: (size: string) =>
    `File too large. Maximum file size allowed is ${size}.`,
  ALLOWED_FILE_TYPE: 'Only JPG, JPEG, or PNG files are allowed!',
  ALLOWED_ATTACHMENT_TYPE:
    'Only CSV, DOC, DOCX, JPEG, JPG, PDF, PNG, TXT, and XLSX files are supported!',
  CONTACT_ALREADY_REGISTERED: 'Contact No. is already registered',
  Email_ALREADY_REGISTERED: 'The provided email has already been registered.',
  EMPTY_CART: 'Your cart is empty.',
  QUANTITY_DO_NOT_MATCH: 'Quantities do not match',
  PURCHASE_ORDER_EDIT_NOT_ALLOWED:
    'Editing of partially completed or completed purchase orders is not allowed.',
  ORDER_NOT_FOUND: 'Order not found',
  NOT_FOUND: (value: string) => `${value} not found`,
  RECORD_NOT_FOUND: (text: string) => `${text} Not Found.`,
  OUT_OF_STOCK: (product: string) => `${product} is out of stock!`,
  SCANNED_MORE: 'Scanned barcode exceed ordered quantity',
  INVALID_BARCODE: (barcode: string) =>
    `Inventory with ${barcode} Barcode not found for this product`,
  EXPIRED_BARCODE: (barcode: string) =>
    `Inventory with ${barcode} Barcode is expired`,
  INVENTORY_NOT_AVAILABLE: (barcode: string, remaining_quantity: number) =>
    `No more products available for the barcode ${barcode}. Only ${remaining_quantity} quantity remaining.`,
  ORDER_ITEMS_NOT_MATCH:
    'Scanned quantity does not match the ordered quantity. Verify for accurate inventory reconciliation.',
  REACHED_EXPORT_LIMIT: (limit: string) =>
    `Export limit reached: ${limit} entries max.`,
  SAME_NUMBER:
    'The number you entered is already your current number. Please enter a different number.',
  SAME_EMAIL:
    'The email you entered is already your current email. Please enter a different email.',
};

const VALIDATION = {
  MIN_LENGTH: (field: string, length: string) =>
    `${field} must be of minimum length ${length}.`,
  REQUIRED: (text: string) => `${text} is required`,
  EMAIL_PATTERN:
    'Email must be lowercase and match the format: example@domain.com.',
  PASSWORD_PATTERN:
    'Password must have a capital, small, and special character.',
  COUNTRY_CODE:
    'Country code must start with a plus sign (+) and only contain digits',
  CONTACT_FORMAT: 'Invalid contact number format.',
  IMAGE_PATTERN:
    'Image format not allowed. Allowed name pattern: uuidv4.jpg | uuidv4.jpeg | uuidv4.png | user.png',
  SUPPLIER_PATTERN: 'Format Not Allowed!',
  TIME_FORMAT: 'Expected Delivery Time should be in HH:MM:SS format (24-hour).',
};

const EMAIL = {
  CONTACT_US: 'Contact Us | KAS Foods',
  ACCOUNT_APPROVAL: 'Your account has been approved! | KAS Foods',
  NEW_PURCHASE_ORDER: 'You have new purchase order from KAS Foods.',
  VERIFICATION_OTP_SUBJECT: 'Your KAS Foods Verification OTP',
  BARCODE_ATTACHED: 'Inventory Update - Barcode Stickers Attached | KAS Foods.',
  WELCOME_SUPPLIER: 'Welcome to KAS Foods Supplier Network!',
  FORGOT_PASSWORD: 'Password Reset Request | KAS Foods.',
  ORDER_DOCUMENTS: (order_id: string) =>
    `Order ${order_id} Picked Up - PDF is attached | KAS Foods.`,
  DELIVERY_CANCELLED: (order_id: string) =>
    `Delivery Cancelled For Order ${order_id} | KAS Foods.`,
  ORDER_DELIVERED: (order_id: string) =>
    `Order ${order_id} Delivered - PDF & Invoice is attached | KAS Foods.`,
  ORDER_CREATED: (order_id: string) =>
    `Order ${order_id} Placed Successfully! | KAS Foods.`,
  ORDER_CANCELLED: (order_id: string) =>
    `Order ${order_id} Has Been Cancelled Successfully! | KAS Foods.`,
};

export const CONSTANT = {
  SUCCESS: SUCCESS,
  VALIDATION: VALIDATION,
  ERROR: ERROR,
  EMAIL: EMAIL,
};
