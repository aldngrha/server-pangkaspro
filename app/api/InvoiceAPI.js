const puppeteer = require("puppeteer");
const Transaction = require("../../models/transaction");
const fs = require("fs");

const GetInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    const invoice = await Transaction.findOne({
      _id: id,
      userId: user,
    })
      .populate({ path: "barberId", select: "_id name price shippingCost" })
      .populate({ path: "kapsterId", select: "_id name" })
      .populate({ path: "userId", select: "_id name address phoneNumber" });

    console.log(invoice);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreDefaultArgs: ["--disable-extensions"],
    });
    const page = await browser.newPage();

    await page.setContent(generateHtmlContent(invoice));
    const pdf = await page.pdf();

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=invoice-order.pdf"
    );
    res.send(pdf);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Function to generate HTML content for invoice details
function generateHtmlContent(invoice) {
  const dateString = invoice.createdAt;
  const dateObj = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = dateObj.toLocaleDateString("id-ID", options);
  // Modify this function based on your invoice data structure and Tailwind CSS classes
  return `
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title> Order confirmation </title>
    <meta name="robots" content="noindex,nofollow" />
    <meta name="viewport" content="width=device-width; initial-scale=1.0;" />
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
      body { margin: 0; padding: 0; background: #e1e1e1; }
      div, p, a, li, td { -webkit-text-size-adjust: none; }
      .ReadMsgBody { width: 100%; background-color: #ffffff; }
      .ExternalClass { width: 100%; background-color: #ffffff; }
      body { width: 100%; height: 100%; background-color: #e1e1e1; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      html { width: 100%; }
      p { padding: 0 !important; margin-top: 0 !important; margin-right: 0 !important; margin-bottom: 0 !important; margin-left: 0 !important; }
      .visibleMobile { display: none; }
      .hiddenMobile { display: block; }
    
      @media only screen and (max-width: 600px) {
      body { width: auto !important; }
      table[class=fullTable] { width: 96% !important; clear: both; }
      table[class=fullPadding] { width: 85% !important; clear: both; }
      table[class=col] { width: 45% !important; }
      .erase { display: none; }
      }
    
      @media only screen and (max-width: 420px) {
      table[class=fullTable] { width: 100% !important; clear: both; }
      table[class=fullPadding] { width: 85% !important; clear: both; }
      table[class=col] { width: 100% !important; clear: both; }
      table[class=col] td { text-align: left !important; }
      .erase { display: none; font-size: 0; max-height: 0; line-height: 0; padding: 0; }
      .visibleMobile { display: block !important; }
      .hiddenMobile { display: none !important; }
      }
    </style>
    <!-- Header -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
      <tr>
        <td height="20"></td>
      </tr>
      <tr>
        <td>
          <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 10px 10px 0 0;">
            <tr class="hiddenMobile">
              <td height="40"></td>
            </tr>
            <tr class="visibleMobile">
              <td height="30"></td>
            </tr>
    
            <tr>
              <td>
                <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody>
                    <tr>
                      <td>
                        <table width="220" border="0" cellpadding="0" cellspacing="0" align="left" class="col">
                          <tbody>
                            <tr>
                              <td align="left"> 
                                <svg width="120" height="45" viewBox="0 0 174 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="124.5" cy="22.5" r="22.5" fill="#D25B04"/>
                                    <path d="M4.68 34.27C3.8 34.27 3.12 34.03 2.64 33.55C2.16 33.05 1.92 32.36 1.92 31.48V15.64C1.92 14.74 2.16 14.05 2.64 13.57C3.14 13.09 3.83 12.85 4.71 12.85H12.09C14.49 12.85 16.34 13.47 17.64 14.71C18.96 15.93 19.62 17.62 19.62 19.78C19.62 21.94 18.96 23.64 17.64 24.88C16.34 26.1 14.49 26.71 12.09 26.71H7.44V31.48C7.44 32.36 7.21 33.05 6.75 33.55C6.29 34.03 5.6 34.27 4.68 34.27ZM7.44 22.48H11.13C12.17 22.48 12.97 22.26 13.53 21.82C14.09 21.36 14.37 20.68 14.37 19.78C14.37 18.86 14.09 18.18 13.53 17.74C12.97 17.3 12.17 17.08 11.13 17.08H7.44V22.48ZM26.3189 34.33C25.1789 34.33 24.1689 34.12 23.2889 33.7C22.4289 33.28 21.7489 32.71 21.2489 31.99C20.7689 31.25 20.5289 30.41 20.5289 29.47C20.5289 28.39 20.8089 27.54 21.3689 26.92C21.9289 26.3 22.8289 25.86 24.0689 25.6C25.3089 25.32 26.9589 25.18 29.0189 25.18H30.6689V27.7H29.0189C28.2389 27.7 27.5889 27.76 27.0689 27.88C26.5689 27.98 26.1989 28.15 25.9589 28.39C25.7189 28.61 25.5989 28.9 25.5989 29.26C25.5989 29.72 25.7589 30.1 26.0789 30.4C26.4189 30.7 26.8989 30.85 27.5189 30.85C28.0189 30.85 28.4589 30.74 28.8389 30.52C29.2389 30.3 29.5589 30 29.7989 29.62C30.0389 29.22 30.1589 28.76 30.1589 28.24V24.76C30.1589 24.04 29.9689 23.53 29.5889 23.23C29.2289 22.93 28.5989 22.78 27.6989 22.78C27.2189 22.78 26.6789 22.84 26.0789 22.96C25.4789 23.06 24.8089 23.25 24.0689 23.53C23.5289 23.73 23.0689 23.76 22.6889 23.62C22.3089 23.48 22.0089 23.24 21.7889 22.9C21.5889 22.56 21.4889 22.19 21.4889 21.79C21.5089 21.39 21.6389 21.01 21.8789 20.65C22.1389 20.29 22.5289 20.01 23.0489 19.81C24.0089 19.45 24.8889 19.21 25.6889 19.09C26.5089 18.97 27.2589 18.91 27.9389 18.91C29.5789 18.91 30.9289 19.15 31.9889 19.63C33.0689 20.09 33.8689 20.81 34.3889 21.79C34.9289 22.75 35.1989 23.99 35.1989 25.51V31.57C35.1989 32.45 34.9889 33.12 34.5689 33.58C34.1489 34.04 33.5389 34.27 32.7389 34.27C31.9189 34.27 31.2889 34.04 30.8489 33.58C30.4289 33.12 30.2189 32.45 30.2189 31.57V30.79L30.3989 31.21C30.2989 31.85 30.0689 32.4 29.7089 32.86C29.3489 33.32 28.8789 33.68 28.2989 33.94C27.7189 34.2 27.0589 34.33 26.3189 34.33ZM40.8797 34.27C40.0397 34.27 39.3897 34.04 38.9297 33.58C38.4697 33.12 38.2397 32.45 38.2397 31.57V21.64C38.2397 20.78 38.4597 20.12 38.8997 19.66C39.3597 19.2 40.0097 18.97 40.8497 18.97C41.6897 18.97 42.3297 19.2 42.7697 19.66C43.2097 20.12 43.4297 20.78 43.4297 21.64V23.05L43.0997 21.82C43.5797 20.88 44.2597 20.16 45.1397 19.66C46.0397 19.16 47.0597 18.91 48.1997 18.91C49.3797 18.91 50.3497 19.14 51.1097 19.6C51.8697 20.04 52.4397 20.74 52.8197 21.7C53.1997 22.64 53.3897 23.83 53.3897 25.27V31.57C53.3897 32.45 53.1597 33.12 52.6997 33.58C52.2397 34.04 51.5797 34.27 50.7197 34.27C49.8597 34.27 49.1997 34.04 48.7397 33.58C48.2797 33.12 48.0497 32.45 48.0497 31.57V25.48C48.0497 24.58 47.8897 23.94 47.5697 23.56C47.2697 23.18 46.8197 22.99 46.2197 22.99C45.4197 22.99 44.7797 23.25 44.2997 23.77C43.8197 24.27 43.5797 24.95 43.5797 25.81V31.57C43.5797 33.37 42.6797 34.27 40.8797 34.27ZM63.753 39.73C62.653 39.73 61.623 39.65 60.663 39.49C59.703 39.35 58.873 39.14 58.173 38.86C57.593 38.66 57.183 38.37 56.943 37.99C56.703 37.61 56.593 37.21 56.613 36.79C56.633 36.37 56.743 35.99 56.943 35.65C57.163 35.31 57.453 35.06 57.813 34.9C58.173 34.76 58.573 34.77 59.013 34.93C59.893 35.29 60.693 35.52 61.413 35.62C62.133 35.74 62.743 35.8 63.243 35.8C64.463 35.8 65.373 35.54 65.973 35.02C66.593 34.52 66.903 33.73 66.903 32.65V30.76H67.143C66.843 31.6 66.233 32.29 65.313 32.83C64.393 33.35 63.393 33.61 62.313 33.61C60.993 33.61 59.843 33.31 58.863 32.71C57.883 32.09 57.113 31.23 56.553 30.13C56.013 29.03 55.743 27.74 55.743 26.26C55.743 25.14 55.903 24.13 56.223 23.23C56.543 22.33 56.983 21.56 57.543 20.92C58.123 20.28 58.813 19.79 59.613 19.45C60.433 19.09 61.333 18.91 62.313 18.91C63.433 18.91 64.433 19.17 65.313 19.69C66.213 20.21 66.813 20.89 67.113 21.73L66.813 22.96V21.64C66.813 20.78 67.043 20.12 67.503 19.66C67.983 19.2 68.643 18.97 69.483 18.97C70.323 18.97 70.963 19.2 71.403 19.66C71.863 20.12 72.093 20.78 72.093 21.64V32.02C72.093 34.58 71.373 36.5 69.933 37.78C68.493 39.08 66.433 39.73 63.753 39.73ZM63.963 29.68C64.563 29.68 65.073 29.55 65.493 29.29C65.913 29.01 66.243 28.62 66.483 28.12C66.723 27.6 66.843 26.98 66.843 26.26C66.843 25.18 66.583 24.34 66.063 23.74C65.543 23.14 64.843 22.84 63.963 22.84C63.403 22.84 62.903 22.98 62.463 23.26C62.023 23.52 61.683 23.91 61.443 24.43C61.223 24.93 61.113 25.54 61.113 26.26C61.113 27.34 61.373 28.18 61.893 28.78C62.413 29.38 63.103 29.68 63.963 29.68ZM77.8523 34.27C77.0123 34.27 76.3623 34.04 75.9023 33.58C75.4423 33.12 75.2123 32.45 75.2123 31.57V15.28C75.2123 14.4 75.4423 13.73 75.9023 13.27C76.3623 12.81 77.0123 12.58 77.8523 12.58C78.7123 12.58 79.3723 12.81 79.8323 13.27C80.3123 13.73 80.5523 14.4 80.5523 15.28V25.18H80.6123L84.2723 20.74C84.7723 20.14 85.2323 19.7 85.6523 19.42C86.0923 19.12 86.6823 18.97 87.4223 18.97C88.1623 18.97 88.7323 19.15 89.1323 19.51C89.5323 19.87 89.7423 20.32 89.7623 20.86C89.7823 21.4 89.5623 21.94 89.1023 22.48L85.1423 27.16V25.3L89.5823 30.88C90.0223 31.44 90.2023 31.99 90.1223 32.53C90.0423 33.05 89.7823 33.47 89.3423 33.79C88.9223 34.11 88.3823 34.27 87.7223 34.27C86.9223 34.27 86.2823 34.13 85.8023 33.85C85.3223 33.55 84.8423 33.09 84.3623 32.47L80.6123 27.85H80.5523V31.57C80.5523 33.37 79.6523 34.27 77.8523 34.27ZM97.5982 34.33C96.4582 34.33 95.4482 34.12 94.5682 33.7C93.7082 33.28 93.0282 32.71 92.5282 31.99C92.0482 31.25 91.8082 30.41 91.8082 29.47C91.8082 28.39 92.0882 27.54 92.6482 26.92C93.2082 26.3 94.1082 25.86 95.3482 25.6C96.5882 25.32 98.2382 25.18 100.298 25.18H101.948V27.7H100.298C99.5182 27.7 98.8682 27.76 98.3482 27.88C97.8482 27.98 97.4782 28.15 97.2382 28.39C96.9982 28.61 96.8782 28.9 96.8782 29.26C96.8782 29.72 97.0382 30.1 97.3582 30.4C97.6982 30.7 98.1782 30.85 98.7982 30.85C99.2982 30.85 99.7382 30.74 100.118 30.52C100.518 30.3 100.838 30 101.078 29.62C101.318 29.22 101.438 28.76 101.438 28.24V24.76C101.438 24.04 101.248 23.53 100.868 23.23C100.508 22.93 99.8782 22.78 98.9782 22.78C98.4982 22.78 97.9582 22.84 97.3582 22.96C96.7582 23.06 96.0882 23.25 95.3482 23.53C94.8082 23.73 94.3482 23.76 93.9682 23.62C93.5882 23.48 93.2882 23.24 93.0682 22.9C92.8682 22.56 92.7682 22.19 92.7682 21.79C92.7882 21.39 92.9182 21.01 93.1582 20.65C93.4182 20.29 93.8082 20.01 94.3282 19.81C95.2882 19.45 96.1682 19.21 96.9682 19.09C97.7882 18.97 98.5382 18.91 99.2182 18.91C100.858 18.91 102.208 19.15 103.268 19.63C104.348 20.09 105.148 20.81 105.668 21.79C106.208 22.75 106.478 23.99 106.478 25.51V31.57C106.478 32.45 106.268 33.12 105.848 33.58C105.428 34.04 104.818 34.27 104.018 34.27C103.198 34.27 102.568 34.04 102.128 33.58C101.708 33.12 101.498 32.45 101.498 31.57V30.79L101.678 31.21C101.578 31.85 101.348 32.4 100.988 32.86C100.628 33.32 100.158 33.68 99.5782 33.94C98.9982 34.2 98.3382 34.33 97.5982 34.33ZM115.399 34.33C114.519 34.33 113.619 34.26 112.699 34.12C111.799 34 110.979 33.77 110.239 33.43C109.739 33.23 109.379 32.96 109.159 32.62C108.959 32.28 108.859 31.92 108.859 31.54C108.879 31.16 108.989 30.82 109.189 30.52C109.409 30.2 109.689 29.98 110.029 29.86C110.389 29.72 110.789 29.73 111.229 29.89C112.069 30.19 112.819 30.41 113.479 30.55C114.159 30.67 114.809 30.73 115.429 30.73C116.169 30.73 116.699 30.63 117.019 30.43C117.339 30.21 117.499 29.93 117.499 29.59C117.499 29.29 117.389 29.06 117.169 28.9C116.969 28.74 116.679 28.63 116.299 28.57L112.969 28.03C111.729 27.81 110.769 27.36 110.089 26.68C109.409 25.98 109.069 25.07 109.069 23.95C109.069 22.91 109.359 22.02 109.939 21.28C110.539 20.52 111.349 19.94 112.369 19.54C113.409 19.12 114.599 18.91 115.939 18.91C116.839 18.91 117.659 18.98 118.399 19.12C119.139 19.24 119.859 19.47 120.559 19.81C120.999 19.99 121.309 20.25 121.489 20.59C121.669 20.93 121.739 21.29 121.699 21.67C121.659 22.03 121.529 22.37 121.309 22.69C121.109 22.99 120.829 23.2 120.469 23.32C120.109 23.42 119.689 23.39 119.209 23.23C118.549 22.97 117.959 22.78 117.439 22.66C116.939 22.54 116.469 22.48 116.029 22.48C115.209 22.48 114.629 22.59 114.289 22.81C113.949 23.03 113.779 23.31 113.779 23.65C113.779 23.91 113.869 24.13 114.049 24.31C114.229 24.47 114.509 24.58 114.889 24.64L118.219 25.21C119.499 25.41 120.479 25.85 121.159 26.53C121.859 27.19 122.209 28.09 122.209 29.23C122.209 30.85 121.589 32.11 120.349 33.01C119.109 33.89 117.459 34.33 115.399 34.33ZM127.522 34.27C126.642 34.27 125.962 34.03 125.482 33.55C125.002 33.05 124.762 32.36 124.762 31.48V15.64C124.762 14.74 125.002 14.05 125.482 13.57C125.982 13.09 126.672 12.85 127.552 12.85H134.932C137.332 12.85 139.182 13.47 140.482 14.71C141.802 15.93 142.462 17.62 142.462 19.78C142.462 21.94 141.802 23.64 140.482 24.88C139.182 26.1 137.332 26.71 134.932 26.71H130.282V31.48C130.282 32.36 130.052 33.05 129.592 33.55C129.132 34.03 128.442 34.27 127.522 34.27ZM130.282 22.48H133.972C135.012 22.48 135.812 22.26 136.372 21.82C136.932 21.36 137.212 20.68 137.212 19.78C137.212 18.86 136.932 18.18 136.372 17.74C135.812 17.3 135.012 17.08 133.972 17.08H130.282V22.48ZM147.112 34.27C146.232 34.27 145.552 34.04 145.072 33.58C144.612 33.12 144.382 32.45 144.382 31.57V21.64C144.382 20.78 144.602 20.12 145.042 19.66C145.502 19.2 146.152 18.97 146.992 18.97C147.832 18.97 148.472 19.2 148.912 19.66C149.352 20.12 149.572 20.78 149.572 21.64V22.87H149.272C149.472 21.67 149.982 20.72 150.802 20.02C151.642 19.32 152.682 18.95 153.922 18.91C154.502 18.89 154.932 19.04 155.212 19.36C155.512 19.66 155.672 20.23 155.692 21.07C155.692 21.79 155.542 22.36 155.242 22.78C154.942 23.2 154.372 23.45 153.532 23.53L152.842 23.59C151.782 23.69 151.012 23.99 150.532 24.49C150.052 24.97 149.812 25.69 149.812 26.65V31.57C149.812 32.45 149.582 33.12 149.122 33.58C148.662 34.04 147.992 34.27 147.112 34.27ZM164.596 34.33C162.956 34.33 161.526 34.02 160.306 33.4C159.086 32.78 158.136 31.89 157.456 30.73C156.776 29.57 156.436 28.2 156.436 26.62C156.436 25.42 156.626 24.35 157.006 23.41C157.386 22.45 157.936 21.64 158.656 20.98C159.376 20.3 160.236 19.79 161.236 19.45C162.236 19.09 163.356 18.91 164.596 18.91C166.236 18.91 167.666 19.22 168.886 19.84C170.106 20.46 171.046 21.35 171.706 22.51C172.386 23.65 172.726 25.02 172.726 26.62C172.726 27.8 172.536 28.87 172.156 29.83C171.776 30.79 171.226 31.61 170.506 32.29C169.806 32.95 168.946 33.46 167.926 33.82C166.926 34.16 165.816 34.33 164.596 34.33ZM164.596 30.4C165.136 30.4 165.616 30.27 166.036 30.01C166.456 29.73 166.776 29.32 166.996 28.78C167.236 28.22 167.356 27.5 167.356 26.62C167.356 25.28 167.096 24.32 166.576 23.74C166.056 23.14 165.396 22.84 164.596 22.84C164.056 22.84 163.576 22.97 163.156 23.23C162.736 23.49 162.406 23.9 162.166 24.46C161.926 25 161.806 25.72 161.806 26.62C161.806 27.94 162.066 28.9 162.586 29.5C163.106 30.1 163.776 30.4 164.596 30.4Z" fill="black"/>
                                </svg>
                              </td>
                            </tr>
                            <tr class="hiddenMobile">
                              <td height="40"></td>
                            </tr>
                            <tr class="visibleMobile">
                              <td height="20"></td>
                            </tr>
                            <tr>
                              <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;">
                                Halo, ${invoice.name}.
                                <br> Terimakasih atas kepercayaan anda dalam menggunakan layanan kami.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table width="220" border="0" cellpadding="0" cellspacing="0" align="right" class="col">
                          <tbody>
                            <tr class="visibleMobile">
                              <td height="20"></td>
                            </tr>
                            <tr>
                              <td height="5"></td>
                            </tr>
                            <tr>
                              <td style="font-size: 21px; color: #D25B04; letter-spacing: 3px; font-family: 'Open Sans', sans-serif; line-height: 1; vertical-align: top; text-align: right;">
                                INVOICE
                              </td>
                            </tr>
                            <tr>
                            <tr class="hiddenMobile">
                              <td height="50"></td>
                            </tr>
                            <tr class="visibleMobile">
                              <td height="20"></td>
                            </tr>
                            <tr>
                              <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: right;">
                                ${invoice.invoiceNumber}<br />
                                ${formattedDate}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!-- /Header -->
    <!-- Order Details -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
      <tbody>
        <tr>
          <td>
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
              <tbody>
                <tr>
                <tr class="hiddenMobile">
                  <td height="60"></td>
                </tr>
                <tr class="visibleMobile">
                  <td height="40"></td>
                </tr>
                <tr>
                  <td>
                    <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                      <tbody>
                        <tr>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;" width="35%" align="left">
                            Barbershop
                          </th>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left">
                            Kapster
                          </th>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left">
                            Harga
                          </th>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left">
                            Jumlah Orang
                          </th>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="right">
                            Subtotal
                          </th>
                        </tr>
                        <tr>
                          <td height="1" style="background: #bebebe;" colspan="5"></td>
                        </tr>
                        <tr>
                          <td height="10" colspan="5"></td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #D25B04;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                            ${invoice.barberId.name}
                          </td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;">${
                            invoice.kapsterId.name
                          }</td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;">Rp${invoice.barberId.price.toLocaleString(
                            "id-ID"
                          )}</td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="left">${
                            invoice.quantity
                          }</td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right">Rp${(
                            invoice.barberId.price * invoice.quantity
                          ).toLocaleString("id-ID")}</td>
                        </tr>
                        <tr>
                          <td height="1" colspan="5" style="border-bottom:1px solid #e4e4e4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
      <tbody>
        <tr>
          <td>
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
              <tbody>
                <tr>
                <tr>
                    <td>
                        <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                            <tbody>
                              <td style="font-size: 15px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;">
                                ORDER TAMBAHAN
                              </td>
                            </tbody>  
                        </table>
                    </td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
      <tbody>
        <tr>
          <td>
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
              <tbody>
                <tr>
                <tr>
                  <td>
                    <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                      <tbody>
                        <tr>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;" width="45%" align="left">
                            Jumlah Orang
                          </th>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left">
                            Harga
                          </th>
                          <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="right">
                            Subtotal
                          </th>
                        </tr>
                        <tr>
                          <td height="1" style="background: #bebebe;" colspan="4"></td>
                        </tr>
                        <tr>
                          <td height="10" colspan="4"></td>
                        </tr>
                        ${
                          invoice.addOns.length > 0
                            ? `<tr>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;">${
                            invoice.addOns[0].quantity
                          }</td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="left">Rp${invoice.barberId.price.toLocaleString(
                            "id-ID"
                          )}</td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right">Rp${invoice.addOns[0].totalAddon.toLocaleString(
                            "id-ID"
                          )}</td>
                        </tr>`
                            : `<tr>
                                <td colspan="3" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center">Tidak ada order tambahan</td>
                               </tr>`
                        }
                        <tr>
                          <td height="1" colspan="3" style="border-bottom:1px solid #e4e4e4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="20"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- /Order Details -->
    <!-- Total -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
      <tbody>
        <tr>
          <td>
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
              <tbody>
                <tr>
                  <td>
    
                    <!-- Table Total -->
                    <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                      <tbody>
                        <tr>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; ">
                            <strong>Biaya Perjalanan</strong>
                          </td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; ">
                            <strong>Rp${invoice.barberId.shippingCost.toLocaleString(
                              "id-ID"
                            )}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                            <strong>Total Biaya</strong>
                          </td>
                          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                            <strong>Rp${invoice.totalAmount.toLocaleString(
                              "id-ID"
                            )}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- /Table Total -->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- /Total -->
    <!-- Information -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
      <tbody>
        <tr>
          <td>
            <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
              <tbody>
                <tr>
                <tr class="hiddenMobile">
                  <td height="60"></td>
                </tr>
                <tr class="visibleMobile">
                  <td height="40"></td>
                </tr>
                <tr>
                  <td>
                    <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                      <tbody>
                        <tr>
                          <td>
                            <table width="220" border="0" cellpadding="0" cellspacing="0" align="left" class="col">
    
                              <tbody>
                                <tr>
                                  <td style="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                                    <strong>INFORMASI TAGIHAN</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="100%" height="10"></td>
                                </tr>
                                <tr>
                                  <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                    ${invoice.name}<br> ${invoice.address}
                                    <br>No. HP: ${invoice.phoneNumber}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
    
                            <table width="220" border="0" cellpadding="0" cellspacing="0" align="right" class="col">
                              <tbody>
                                <tr class="visibleMobile">
                                  <td height="20"></td>
                                </tr>
                                <tr>
                                  <td style="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                                    <strong>METODE PEMBAYARAN</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="100%" height="10"></td>
                                </tr>
                                <tr>
                                ${
                                  invoice.payments.paymentMethod === "Transfer"
                                    ? `<td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                    ${invoice.payments.paymentMethod}<br> Bank: ${invoice.payments.bankName}<br> Pemilik: ${invoice.payments.accountHolder}<br>
                                  </td>`
                                    : `<td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                    ${invoice.payments.paymentMethod}</td>`
                                }
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                      <tbody>
                        <tr>
                          <td>
                            <table width="220" border="0" cellpadding="0" cellspacing="0" align="left" class="col">
                              <tbody>
                                <tr class="hiddenMobile">
                                  <td height="35"></td>
                                </tr>
                                <tr class="visibleMobile">
                                  <td height="20"></td>
                                </tr>
                                <tr>
                                  <td style="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                                    <strong>INFORMASI BARBER</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="100%" height="10"></td>
                                </tr>
                                <tr>
                                  <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                    ${invoice.barberId.name}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr class="hiddenMobile">
                  <td height="60"></td>
                </tr>
                <tr class="visibleMobile">
                  <td height="30"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- /Information -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
    
      <tr>
        <td>
          <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 0 0 10px 10px;">
            <tr>
              <td>
                <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody>
                    <tr>
                      <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;">
                        Semoga harimu menyenangkan.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr class="spacer">
              <td height="50"></td>
            </tr>
    
          </table>
        </td>
      </tr>
      <tr>
        <td height="20"></td>
      </tr>
    </table>
  `;
}

module.exports = { GetInvoice };
