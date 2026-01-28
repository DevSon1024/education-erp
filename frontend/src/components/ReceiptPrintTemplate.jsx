import React from 'react';
import moment from 'moment';

const ReceiptPrintTemplate = React.forwardRef(({ receipt }, ref) => {
  if (!receipt) return null;

  // Convert number to words (Indian style)
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const amountInWords = numberToWords(Math.floor(receipt.amountPaid)) + ' Only';

  // Single Receipt Component
  const SingleReceipt = () => (
    <div style={{ 
      width: '100%',
      height: '48vh',
      border: '1px solid #ddd',
      padding: '10px 15px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      boxSizing: 'border-box',
      pageBreakInside: 'avoid'
    }}>
      {/* Header with Logo and Branch Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src="/src/assets/logo2.png" 
            alt="Smart Institute Logo"
            style={{ 
              width: '100px', 
              height: '100px',
              objectFit: 'contain'
            }}
          />
        </div>
        
        <div style={{ textAlign: 'right', flex: 1 }}>
          <h2 style={{ 
            margin: '0 0 4px 0',
            fontSize: '18px',
            color: '#3498db',
            fontWeight: 'bold'
          }}>
            {receipt.student?.branchId?.name || receipt.student?.branchName || 'Main Branch'}
          </h2>
          <p style={{ margin: '2px 0', fontSize: '9px', color: '#555', lineHeight: '1.3' }}>
            {receipt.student?.branchId?.address || '309-A, 309-B, 3rd Floor, Sai Square Building'}<br/>
            {receipt.student?.branchId?.city || 'Bhestan'}, {receipt.student?.branchId?.state || 'Gujarat'} (INDIA)
          </p>
          <p style={{ margin: '2px 0', fontSize: '9px', color: '#555' }}>
            {receipt.student?.branchId?.phone && `Ph: ${receipt.student.branchId.phone}, `}
            Mob: {receipt.student?.branchId?.mobile || '9601749300'}
          </p>
          <p style={{ margin: '2px 0', fontSize: '9px', color: '#3498db' }}>
            Email: {receipt.student?.branchId?.email || 'smartinstitutes@gmail.com'}
          </p>
        </div>
      </div>

      {/* Receipt Title and Info */}
      <div style={{ 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '5px',
        marginBottom: '6px',
        borderTop: '2px solid #3498db',
        borderBottom: '2px solid #3498db'
      }}>
        <h3 style={{ 
          margin: '0',
          fontSize: '16px',
          color: '#3498db',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          RECEIPT
        </h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <p style={{ margin: '0', fontSize: '9px' }}>
          <strong>Receipt No. :</strong> {receipt.receiptNo}
        </p>
        <p style={{ margin: '0', fontSize: '9px' }}>
          <strong>Receipt Date :</strong> {moment(receipt.date).format('DD-MMMM-YYYY')}
        </p>
      </div>

      {/* Particulars Table */}
      <table style={{ 
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '6px',
        fontSize: '9px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
            <th style={{ 
              border: '1px solid #2980b9',
              padding: '5px 6px',
              textAlign: 'left',
              fontWeight: 'bold'
            }}>
              PARTICULAR
            </th>
            <th style={{ 
              border: '1px solid #2980b9',
              padding: '5px 6px',
              textAlign: 'right',
              fontWeight: 'bold',
              width: '120px'
            }}>
              AMOUNT
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>Received From :</strong> {receipt.student?.firstName} {receipt.student?.lastName}
            </td>
            <td rowSpan="8" style={{ 
              border: '1px solid #ddd',
              padding: '5px 8px',
              textAlign: 'right',
              verticalAlign: 'middle',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              {receipt.amountPaid.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>Enrollment/Reg No :</strong> {receipt.student?.enrollmentNo || receipt.student?.regNo || 'N/A'}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>Father Name :</strong> {receipt.student?.middleName || 'N/A'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>Mobile No :</strong> {receipt.student?.mobileStudent || receipt.student?.mobileParent || 'N/A'}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>Course :</strong> {receipt.course?.name || 'N/A'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>Remarks :</strong> {receipt.remarks || '-'}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>RUPEES IN WORDS :</strong> {amountInWords.toUpperCase()}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>TOTAL FEES :</strong> {receipt.student?.totalFees || 0}
            </td>
          </tr>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>DUE FEES :</strong> {receipt.student?.pendingFees || 0}
            </td>
            <td style={{ 
              border: '1px solid #ddd',
              padding: '5px 8px',
              textAlign: 'right',
              fontWeight: 'bold'
            }}>
              MONTHLY FEES : {receipt.student?.emiDetails?.monthlyInstallment || '-'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
              <strong>THROUGH :</strong> {receipt.paymentMode}
            </td>
            <td style={{ 
              border: '1px solid #ddd',
              padding: '5px 8px',
              textAlign: 'right',
              fontWeight: 'bold'
            }}>
              BATCH TIME : {receipt.student?.batch || 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ 
        marginTop: '8px'
      }}>
        <div>
          <p style={{ 
            margin: '0',
            fontSize: '9px',
            fontWeight: 'bold',
            color: '#e74c3c'
          }}>
            FEES WILL BE NOT REFUNDABLE
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
            <p style={{ 
              margin: '0',
              fontSize: '8px',
              color: '#999'
            }}>
              Website :: www.smartinstitute.co.in
            </p>
            <p style={{ 
              margin: '0',
              fontSize: '7px',
              color: '#999'
            }}>
              Copyright © 2010 Smart Institute. All Rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="print-only">
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: A4 portrait;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .print-only {
              display: block !important;
            }
            .no-print {
              display: none !important;
            }
          }
          @media screen {
            .print-only {
              display: none;
            }
          }
        `}
      </style>
      
      <div style={{ 
        width: '210mm',
        height: '297mm',
        margin: '0',
        padding: '0',
        backgroundColor: 'white'
      }}>
        {/* First Copy */}
        <SingleReceipt />
        
        {/* Dotted Line Separator */}
        <div style={{ 
          borderTop: '2px dashed #999',
          margin: '0',
          height: '0'
        }}></div>
        
        {/* Second Copy */}
        <SingleReceipt />
      </div>
    </div>
  );
});

ReceiptPrintTemplate.displayName = 'ReceiptPrintTemplate';

export default ReceiptPrintTemplate;
