import Link from "next/link";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => console.log("connected"));

const Home: React.FC = () => <h1>Hello World</h1>;

export default Home;
