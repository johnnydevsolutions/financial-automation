/**
 * Legal Document Automation - Structured Notes Payment Calculator
 * 
 * This solution calculates Payment at Maturity for structured financial notes
 * based on Underlying Returns and predefined financial parameters.
 */

// Financial Parameters (configurable)
const FINANCIAL_PARAMS = {
    PRINCIPAL_AMOUNT: 1000,           // $1,000 principal amount per note
    CONTINGENT_INTEREST_RATE: 0.122,  // 12.20% per annum
    MONTHLY_INTEREST_RATE: 0.0101667, // 1.01667% per month
    BUFFER_THRESHOLD: 0.90,           // 90% of Initial Value
    BUFFER_AMOUNT: 0.10,              // 10% Buffer Amount
    CONTINGENT_INTEREST_PAYMENT: 10.1667 // Monthly payment amount
};

/**
 * Calculates Payment at Maturity for a structured note
 * 
 * Logic Explanation:
 * 1. If Final Value >= Buffer Threshold (90% of Initial Value):
 *    Payment = Principal ($1,000) + Contingent Interest Payment ($10.1667)
 * 
 * 2. If Final Value < Buffer Threshold (90% of Initial Value):
 *    Payment = $1,000 + [$1,000 × (Underlying Return + Buffer Amount)]
 *    This formula accounts for losses but provides some protection via Buffer Amount
 * 
 * @param {number} underlyingReturn - The underlying return as a decimal (e.g., 0.60 for 60%)
 * @param {Object} params - Financial parameters (optional, uses defaults if not provided)
 * @returns {number} Payment at maturity amount
 */
function calculatePaymentAtMaturity(underlyingReturn, params = FINANCIAL_PARAMS) {
    // Input validation
    if (typeof underlyingReturn !== 'number') {
        throw new Error('Underlying return must be a number');
    }
    
    if (underlyingReturn < -1) {
        console.warn('Warning: Underlying return less than -100% detected. This represents a total loss scenario.');
    }
    
    const {
        PRINCIPAL_AMOUNT,
        BUFFER_THRESHOLD,
        BUFFER_AMOUNT,
        CONTINGENT_INTEREST_PAYMENT
    } = params;
    
    // Calculate Final Value as percentage of Initial Value
    // Final Value = Initial Value + (Initial Value × Underlying Return)
    // Simplified: Final Value Ratio = 1 + Underlying Return
    const finalValueRatio = 1 + underlyingReturn;
    
    // Apply payment logic based on Buffer Threshold
    if (finalValueRatio >= BUFFER_THRESHOLD) {
        // Scenario 1: Final Value >= 90% of Initial Value
        // Payment = Principal + Contingent Interest
        return PRINCIPAL_AMOUNT + CONTINGENT_INTEREST_PAYMENT;
    } else {
        // Scenario 2: Final Value < 90% of Initial Value
        // Payment = $1,000 + [$1,000 × (Underlying Return + Buffer Amount)]
        const adjustedReturn = underlyingReturn + BUFFER_AMOUNT;
        const payment = PRINCIPAL_AMOUNT + (PRINCIPAL_AMOUNT * adjustedReturn);
        
        // Ensure payment doesn't go below zero (though mathematically possible)
        return Math.max(payment, 0);
    }
}

/**
 * Generates the complete payment table using loops
 * 
 * @param {Object} params - Financial parameters (optional)
 * @returns {Array} Array of objects containing underlying return and payment data
 */
function generatePaymentTable(params = FINANCIAL_PARAMS) {
    const results = [];
    
    // Define the underlying return values as shown in the challenge table
    const underlyingReturns = [
        0.60,   // 60.00%
        0.40,   // 40.00%
        0.20,   // 20.00%
        0.05,   // 5.00%
        0.00,   // 0.00%
        -0.05,  // -5.00%
        -0.10,  // -10.00%
        -0.1001, // -10.01%
        -0.20,  // -20.00%
        -0.30,  // -30.00%
        -0.40,  // -40.00%
        -0.60,  // -60.00%
        -0.80,  // -80.00%
        -1.00   // -100.00%
    ];
    
    // Use loop to calculate payment for each underlying return
    for (let i = 0; i < underlyingReturns.length; i++) {
        const underlyingReturn = underlyingReturns[i];
        
        try {
            const payment = calculatePaymentAtMaturity(underlyingReturn, params);
            
            results.push({
                underlyingReturn: underlyingReturn,
                underlyingReturnPercent: (underlyingReturn * 100).toFixed(2) + '%',
                paymentAtMaturity: payment,
                paymentFormatted: '$' + payment.toFixed(4)
            });
        } catch (error) {
            console.error(`Error calculating payment for return ${underlyingReturn}: ${error.message}`);
            results.push({
                underlyingReturn: underlyingReturn,
                underlyingReturnPercent: (underlyingReturn * 100).toFixed(2) + '%',
                paymentAtMaturity: 'ERROR',
                paymentFormatted: 'ERROR'
            });
        }
    }
    
    return results;
}

/**
 * Displays the payment table in console format
 * 
 * @param {Array} tableData - Array of payment calculation results
 */
function displayPaymentTable(tableData) {
    console.log('\n=== STRUCTURED NOTES PAYMENT TABLE ===');
    console.log('Underlying Return\t\tPayment at Maturity');
    console.log('                \t\t(assuming 12.20% per annum');
    console.log('                \t\tContingent Interest Rate)');
    console.log('================================================');
    
    // Use loop to display each row
    for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i];
        const returnStr = row.underlyingReturnPercent.padEnd(15);
        const paymentStr = row.paymentFormatted;
        console.log(`${returnStr}\t\t${paymentStr}`);
    }
    
    console.log('================================================\n');
}

/**
 * Validates financial parameters
 * 
 * @param {Object} params - Financial parameters to validate
 * @returns {boolean} True if valid, throws error if invalid
 */
function validateFinancialParams(params) {
    const requiredFields = [
        'PRINCIPAL_AMOUNT',
        'CONTINGENT_INTEREST_RATE',
        'BUFFER_THRESHOLD',
        'BUFFER_AMOUNT',
        'CONTINGENT_INTEREST_PAYMENT'
    ];
    
    for (const field of requiredFields) {
        if (typeof params[field] !== 'number') {
            throw new Error(`Invalid parameter: ${field} must be a number`);
        }
    }
    
    if (params.BUFFER_THRESHOLD <= 0 || params.BUFFER_THRESHOLD > 1) {
        throw new Error('Buffer threshold must be between 0 and 1');
    }
    
    if (params.PRINCIPAL_AMOUNT <= 0) {
        throw new Error('Principal amount must be positive');
    }
    
    return true;
}

/**
 * Main execution function
 */
function main() {
    try {
        console.log('Legal Document Automation - Structured Notes Calculator');
        console.log('========================================================');
        
        // Validate parameters
        validateFinancialParams(FINANCIAL_PARAMS);
        
        // Generate the payment table
        const paymentTable = generatePaymentTable();
        
        // Display the results
        displayPaymentTable(paymentTable);
        
        // Additional analysis
        console.log('ANALYSIS:');
        console.log(`- Buffer Threshold: ${(FINANCIAL_PARAMS.BUFFER_THRESHOLD * 100)}%`);
        console.log(`- Contingent Interest Rate: ${(FINANCIAL_PARAMS.CONTINGENT_INTEREST_RATE * 100)}% per annum`);
        console.log(`- Monthly Interest Payment: $${FINANCIAL_PARAMS.CONTINGENT_INTEREST_PAYMENT}`);
        
        const protectedReturns = paymentTable.filter(row => 
            row.paymentAtMaturity === FINANCIAL_PARAMS.PRINCIPAL_AMOUNT + FINANCIAL_PARAMS.CONTINGENT_INTEREST_PAYMENT
        ).length;
        
        console.log(`- ${protectedReturns} out of ${paymentTable.length} scenarios provide full protection with interest`);
        
        return paymentTable;
        
    } catch (error) {
        console.error('Error in main execution:', error.message);
        return null;
    }
}

// Export functions for use in other modules or testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePaymentAtMaturity,
        generatePaymentTable,
        displayPaymentTable,
        validateFinancialParams,
        FINANCIAL_PARAMS
    };
}

// Auto-execute if run directly
if (typeof window === 'undefined') {
    main();
}