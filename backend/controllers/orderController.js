import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems, // 상품명
    orderStatus, // 배송상태
    orderName, // 주문자명
    recipientName,  // 수취인
    shippingCode, // 배송코드
    invoiceNumber, // 송장번호
    orderNumber, // 주문번호
    productOrderNumber, // 상품주문번호
    productNumber, // 상품번호
    productOption, // 상품옵션
    orderQuantity, // 주문상품수량
    itemsPrice, //판매금액
    totalPrice, // 총판매금액
    discountPrice, // 할인금액
    paymentPrice, // 결제금액
    shippingFee, // 배송비
    addShippingFee, // 지역추가배송비,
    rcpPhnNum1, // 수취인전화번호1
    rcpPhnNum2, // 수취인전화번호2
    zipCode, // 우편번호
    shippingAddress, //수취인주소
    ordererPhnNum, // 주문자전화번호1
    shippingMemo, // 배송메모
    shippingDate, // 배송예정일
    howPayShipping, // 배송비지불방법
    shippingCostType, // 배송비유형
    shippingBundleNum, // 배송비묶음번호
    collectionDate, // 수집일시
    paymentDate, // 결제일시
    orderDate, // 주문일시
    lastOrdStatChgDate, // 최종주문상태변경일시
    ownProductCode, // 자체상품코드
    prdOptCode, // 상품옵션코드
    shippingMethod, // 배송방법
    ochShipmentOrder, // 온채널출고지시여부,
    paymentMethod, // 결제수단
    taxPrice, // 세금
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems, // 상품명
      user: req.user._id,
      orderStatus, // 배송상태
      orderName, // 주문자명
      recipientName,  // 수취인
      shippingCode, // 배송코드
      invoiceNumber, // 송장번호
      orderNumber, // 주문번호
      productOrderNumber, // 상품주문번호
      productNumber, // 상품번호
      productOption, // 상품옵션
      orderQuantity, // 주문상품수량
      itemsPrice, //판매금액
      totalPrice, // 총판매금액
      discountPrice, // 할인금액
      paymentPrice, // 결제금액
      shippingFee, // 배송비
      addShippingFee, // 지역추가배송비,
      rcpPhnNum1, // 수취인전화번호1
      rcpPhnNum2, // 수취인전화번호2
      zipCode, // 우편번호
      shippingAddress, //수취인주소
      ordererPhnNum, // 주문자전화번호1
      shippingMemo, // 배송메모
      shippingDate, // 배송예정일
      howPayShipping, // 배송비지불방법
      shippingCostType, // 배송비유형
      shippingBundleNum, // 배송비묶음번호
      collectionDate, // 수집일시
      paymentDate, // 결제일시
      orderDate, // 주문일시
      lastOrdStatChgDate, // 최종주문상태변경일시
      ownProductCode, // 자체상품코드
      prdOptCode, // 상품옵션코드
      shippingMethod, // 배송방법
      ochShipmentOrder, // 온채널출고지시여부,
      paymentMethod, // 결제수단
      taxPrice, // 세금
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}
