exports.paymentSuccess = async (req, res) => {
  //validate event
  var hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(req.body)).digest('hex');
  
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    var event = JSON.parse(req.body);
    console.log(event); 

    // let response = await fetch(`https://api.paystack.co/transaction/verify/${paystackRefNumber}`, {
    //   method: "GET",
    //   headers: {
    //     authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
    //   },
    // });
    
    // console.log(response);  
  }

  res.send(200);
}

exports.payHost = async (req, res) => {
    
}