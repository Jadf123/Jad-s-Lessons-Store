new Vue({
    el: "#app",
    data: {
        lessons: [], // List of lessons fetched from the server
        cart: [], // Items added to the cart
        checkoutForm: { name: "", phone: "" }, // Checkout form inputs
        searchQuery: "", // Search input
    },
    computed: {
        // Filter lessons based on search query
        filteredLessons() {
            return this.lessons.filter((lesson) => 
                lesson.topic.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lesson.location.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        // Calculate total price of items in the cart
        totalPrice() {
            return this.cart.reduce((total, item) => total + item.price, 0);
        },
        // Check if checkout form is valid
        isCheckoutValid() {
            return this.checkoutForm.name.trim() !== "" && /^\d+$/.test(this.checkoutForm.phone);
        },
    },
    methods: {
        // Fetch lessons from the server
        fetchLessons() {
            fetch("http://localhost:4000/api/lessons")
                .then((response) => response.json())
                .then((data) => {
                    this.lessons = data;
                });
        },
        // Add a lesson to the cart
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push(lesson);
                lesson.spaces -= 1;
            }
        },
        // Remove an item from the cart
        removeFromCart(index) {
            const lesson = this.cart[index];
            lesson.spaces += 1;
            this.cart.splice(index, 1);
        },
        // Submit the order
        submitOrder() {
            if (this.isCheckoutValid) {
                fetch("http://localhost:4000/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: this.checkoutForm.name,
                        phone: this.checkoutForm.phone,
                        lessons: this.cart.map((item) => item._id),
                    }),
                }).then(() => {
                    alert("Order submitted successfully!");
                    this.cart = [];
                    this.checkoutForm = { name: "", phone: "" };
                });
            }
        },
    },
    created() {
        this.fetchLessons();
    },
});
