import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

export const generatePDF = async (elementId: string, options: PDFOptions) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Create canvas from HTML element
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.format || 'a4'
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Save the PDF
  pdf.save(options.filename);
};

export const createReportPDF = async (reportData: any) => {
  // Create a temporary div for PDF generation
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-report-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '0';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  tempDiv.innerHTML = `
    <div style="width: 100%; margin: 0; padding: 0;">
      <img src="/image.png" alt="Rifah Laboratories Header" style="width: 100%; height: auto; display: block; margin: 0; padding: 0;" />
    </div>
    
    <div style="padding: 20mm; padding-top: 10mm;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin-bottom: 15px; text-align: center; font-size: 24px;">LABORATORY REPORT</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border: 1px solid #d1d5db; padding: 15px; background-color: #f9fafb;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Patient Name:</strong> ${reportData.patientName}</p>
            <p style="margin: 5px 0;"><strong>Age/Gender:</strong> ${reportData.patientAge} Years / ${reportData.patientGender}</p>
            <p style="margin: 5px 0;"><strong>Contact:</strong> ${reportData.patientContact}</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <p style="margin: 5px 0;"><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Report ID:</strong> ${reportData.reportId}</p>
            <p style="margin: 5px 0;"><strong>Referred By:</strong> ${reportData.doctorName}</p>
          </div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: left; font-weight: bold;">Test Name</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Result</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Normal Range</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Unit</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.tests.map((test: any, index: number) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
              <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: 500;">${test.testName}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; ${test.isAbnormal ? 'color: #dc2626; font-weight: bold;' : 'font-weight: 500;'}">${test.result}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${test.normalRange}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${test.unit || '-'}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">
                <span style="color: ${test.isAbnormal ? '#dc2626' : '#16a34a'}; font-weight: bold;">
                  ${test.isAbnormal ? 'ABNORMAL' : 'NORMAL'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${reportData.interpretation ? `
        <div style="margin-bottom: 20px; border: 1px solid #d1d5db; padding: 15px; background-color: #f9fafb;">
          <h3 style="color: #1e40af; margin-bottom: 10px; font-size: 18px;">Clinical Interpretation & Recommendations</h3>
          <p style="line-height: 1.6; margin: 0;">${reportData.interpretation}</p>
        </div>
      ` : ''}

      ${reportData.criticalValues ? `
        <div style="background-color: #fef2f2; border: 2px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="color: #dc2626; font-size: 20px; margin-right: 10px;">⚠️</span>
            <strong style="color: #dc2626; font-size: 16px;">CRITICAL VALUES DETECTED</strong>
          </div>
          <p style="margin: 0; color: #dc2626; font-weight: 500;">This report contains critical values that require immediate medical attention. Please consult your physician immediately.</p>
        </div>
      ` : ''}

      <div style="margin-top: 30px; border-top: 2px solid #1e40af; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: end;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Verified By:</strong> ${reportData.verifiedBy || 'Dr. Abdul Malik'}</p>
            <p style="margin: 5px 0;"><strong>Verification Date:</strong> ${reportData.verifiedAt ? new Date(reportData.verifiedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Qualification:</strong> M.B.B.S, DCPATH</p>
            <p style="margin: 5px 0;"><strong>Designation:</strong> Clinical Pathologist</p>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto 5px auto;"></div>
            <p style="margin: 0; font-weight: bold;">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 100%; margin-top: 20mm;">
      <img src="/image copy.png" alt="Rifah Laboratories Footer" style="width: 100%; height: auto; display: block;" />
    </div>

    <div style="text-align: center; margin-top: 10px; padding: 0 20mm; font-size: 12px; color: #6b7280;">
      <p style="margin: 5px 0;">Electronically verified report. No signatures required.</p>
      <p style="margin: 5px 0;">Generated on: ${new Date().toLocaleString()}</p>
      <p style="margin: 5px 0; font-style: italic;">This is a computer-generated document and does not require a physical signature.</p>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    await generatePDF('pdf-report-temp', {
      title: 'Laboratory Report',
      filename: `Report_${reportData.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export const createInvoicePDF = async (invoiceData: any) => {
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-invoice-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '0';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  tempDiv.innerHTML = `
    <div style="width: 100%; margin: 0; padding: 0;">
      <img src="/image.png" alt="Rifah Laboratories Header" style="width: 100%; height: auto; display: block; margin: 0; padding: 0;" />
    </div>
    
    <div style="padding: 20mm; padding-top: 10mm;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin-bottom: 15px; text-align: center; font-size: 28px; font-weight: bold;">INVOICE</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border: 1px solid #d1d5db; padding: 15px; background-color: #f9fafb;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
            <p style="margin: 5px 0;"><strong>Invoice Date:</strong> ${new Date(invoiceData.createdAt).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">${invoiceData.status.toUpperCase()}</span></p>
          </div>
          <div style="flex: 1; text-align: right;">
            <p style="margin: 5px 0;"><strong>Patient Name:</strong> ${invoiceData.patientName}</p>
            <p style="margin: 5px 0;"><strong>Referred By:</strong> ${invoiceData.doctorName}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${(invoiceData.paymentMethod || 'Cash').toUpperCase()}</p>
          </div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: left; font-weight: bold;">Test Name</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Qty</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: right; font-weight: bold;">Rate (PKR)</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: right; font-weight: bold;">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.tests.map((test: any, index: number) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
              <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: 500;">${test.testName}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; font-weight: 500;">${test.quantity}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; font-weight: 500;">${test.price.toLocaleString()}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; font-weight: bold;">${(test.price * test.quantity).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-left: auto; width: 350px; border: 2px solid #1e40af; padding: 15px; background-color: #f9fafb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; text-align: right; font-size: 16px;"><strong>Subtotal:</strong></td>
            <td style="padding: 8px; text-align: right; font-size: 16px; font-weight: bold;">PKR ${invoiceData.totalAmount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: right; font-size: 16px;"><strong>Discount:</strong></td>
            <td style="padding: 8px; text-align: right; font-size: 16px; font-weight: bold; color: #dc2626;">- PKR ${invoiceData.discount.toLocaleString()}</td>
          </tr>
          <tr style="border-top: 2px solid #1e40af;">
            <td style="padding: 12px 8px; text-align: right;"><strong style="font-size: 20px; color: #1e40af;">TOTAL AMOUNT:</strong></td>
            <td style="padding: 12px 8px; text-align: right;"><strong style="font-size: 20px; color: #1e40af;">PKR ${invoiceData.finalAmount.toLocaleString()}</strong></td>
          </tr>
        </table>
      </div>

      ${invoiceData.notes ? `
        <div style="margin-top: 20px; border: 1px solid #d1d5db; padding: 15px; background-color: #f9fafb;">
          <h3 style="color: #1e40af; margin-bottom: 10px; font-size: 16px;">Additional Notes</h3>
          <p style="line-height: 1.6; margin: 0;">${invoiceData.notes}</p>
        </div>
      ` : ''}

      <div style="margin-top: 30px; border-top: 2px solid #1e40af; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Created By:</strong> ${invoiceData.createdBy}</p>
            <p style="margin: 5px 0;"><strong>Terms & Conditions:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 12px;">
              <li>Payment is due upon receipt of invoice</li>
              <li>All tests are performed as per standard protocols</li>
              <li>Reports will be available within 24-48 hours</li>
            </ul>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto 5px auto;"></div>
            <p style="margin: 0; font-weight: bold;">Authorized Signature</p>
            <p style="margin: 5px 0; font-size: 12px;">Rifah Laboratories</p>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 100%; margin-top: 20mm;">
      <img src="/image copy.png" alt="Rifah Laboratories Footer" style="width: 100%; height: auto; display: block;" />
    </div>

    <div style="text-align: center; margin-top: 10px; padding: 0 20mm; font-size: 12px; color: #6b7280;">
      <p style="margin: 5px 0;">Thank you for choosing Rifah Laboratories for your healthcare needs</p>
      <p style="margin: 5px 0;">Generated on: ${new Date().toLocaleString()}</p>
      <p style="margin: 5px 0; font-style: italic;">This is a computer-generated invoice and does not require a physical signature.</p>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    await generatePDF('pdf-invoice-temp', {
      title: 'Invoice',
      filename: `Invoice_${invoiceData.invoiceNumber}_${invoiceData.patientName.replace(/\s+/g, '_')}.pdf`
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};