import app from "./app";
const PORT = 3000;



app.listen(PORT, () => {
    console.log(`🚀 Server is running in http://localhost:${PORT}`);
    if (app._router && app._router.stack) {
        app._router.stack.forEach((middleware: any) => {
            if (middleware.route) {
                console.log(`Route registered: ${middleware.route.path}`);
            } else if (middleware.name === 'router') {
                middleware.handle.stack.forEach((handler: any) => {
                    if (handler.route) {
                        console.log(`Route registered: ${handler.route.path}`);
                    }
                });
            }
        });
    }
});

