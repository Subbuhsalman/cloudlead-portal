enum PaymentMethod  {
    WALLET = "WALLET",
    CARD  = "CARD"
  }
  enum OrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    FOOD_ARRIVED = 'FOOD_ARRIVED',
    SCHEDULED = 'SCHEDULED',
    ALL = 'ALL'
  }
  export {PaymentMethod, OrderStatus}