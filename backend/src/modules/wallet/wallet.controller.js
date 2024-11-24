import { WalletModel } from "./../../../Database/models/wallet.model.js";  // Adjust path as needed
import { OrderModel } from "./../../../Database/models/order.model.js";  // Adjust path as needed
// Check wallet balance
async function checkBalance(req, res) {
  try {
    const { userId } = req.params;

    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    return res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Add funds to wallet
async function addFunds(req, res) {
  try {
    const { userId, amount, description } = req.body;

    // Ensure amount is valid
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    // Find the user's wallet
    let wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      wallet = new WalletModel({ userId, balance: 0, transactions: [] });
    }

    // Update balance and create transaction
    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description: description || 'Added funds to wallet',
    });

    // Save the wallet
    await wallet.save();

    return res.status(200).json({
      message: 'Funds added successfully',
      balance: wallet.balance,
    });
  } catch (error) {
    console.error('Error adding funds:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Make payment using wallet
async function makePayment(req, res) {
  try {
    const { userId, amount, description } = req.body;

    // Ensure amount is valid
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    // Find the user's wallet
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    // Check if user has enough balance
    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Deduct the amount from wallet and create transaction
    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'debit',
      amount,
      description: description || 'Payment made using wallet',
    });

    // Save the wallet
    await wallet.save();

    return res.status(200).json({
      message: 'Payment successful',
      balance: wallet.balance,
    });
  } catch (error) {
    console.error('Error making payment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Fetch transaction history
async function getTransactionHistory(req, res) {
  try {
    const { userId } = req.params;

    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    return res.status(200).json({ transactions: wallet.transactions });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
async function returnPayment(req, res) {
    try {
      const { orderId, amount, description } = req.body;
  
      // Ensure the amount is valid and greater than zero
      if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
      }
  
      // Find the order by ID
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order was paid and is eligible for a return
      if (!order.isPaid || order.isDelivered === false) {
        return res.status(400).json({ message: 'Order is not eligible for return' });
      }
  
      // Find the user's wallet
      const wallet = await WalletModel.findOne({ userId: order.userId });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found for this user' });
      }
  
      // Credit the amount back to the wallet
      wallet.balance += amount;
      wallet.transactions.push({
        type: 'credit',
        amount,
        description: description || 'Refund due to returned order',
      });
  
      // Save the updated wallet
      await wallet.save();
  
      // Optionally update the order status
      order.isPaid = false; // Mark as not paid since the payment was returned
      order.isDelivered = false; // Mark as not delivered
      order.deliveredAt = null; // Clear delivery date
      order.paidAt = null; // Clear paid date
  
      await order.save();
  
      return res.status(200).json({
        message: 'Payment successfully returned to wallet',
        balance: wallet.balance,
      });
    } catch (error) {
      console.error('Error returning payment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

export { checkBalance, addFunds, makePayment, getTransactionHistory, returnPayment };
