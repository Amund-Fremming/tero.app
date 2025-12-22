# Hub connection: multiple connections created

- problem: for each time a game was created, it opened another socket, causing crashes and alot of wierd errors
- cause: react navigation stores cached pages when you directly navigate somewhere, causing the underlying conneciton to lay there and waif ro the next time that screen was rendered, but then with another screen also being rendered
- solution: clean the stack when navigating to a random spot, if else use go back to pop the screen from cache
