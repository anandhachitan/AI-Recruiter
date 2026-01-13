import { Button } from "@/components/ui/button";
import Image from "next/image";
import Provider from "./provider";

export default function Home() {
  return (
    <Provider>
      {" "}
      <div>
        {" "}
        <h1>AI-Interview-scheduler</h1> <Button>Submit</Button>{" "}
      </div>{" "}
    </Provider>
  );
}
