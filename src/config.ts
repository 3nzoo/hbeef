export const config = {
  aws_category: import.meta.env.VITE_AWS_CATEGORY_TABLE,
  aws_menu: import.meta.env.VITE_AWS_MENU_TABLE,
  aws_key_id: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  aws_secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  aws_region: import.meta.env.VITE_AWS_REGION,
  aws_bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
  aws_contactTable: import.meta.env.VITE_AWS_CONTACT_TABLE,
  aws_dateTable: import.meta.env.VITE_AWS_DATE_TABLE,
  aws_apiUrl: import.meta.env.VITE_API_URL,
  aws_headers: import.meta.env.VITE_HEADERS_KEY,
  aws_topicArn: import.meta.env.VITE_TOPIC_ARN,
  aws_userTable: import.meta.env.VITE_AWS_USER_TABLE,
};
