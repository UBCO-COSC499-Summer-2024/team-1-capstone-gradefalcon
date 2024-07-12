import React from "react";
import { Link } from "react-router-dom";
import "../../css/App.css";
import "../../css/Classes.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ListClasses from "../../components/ListClasses";

const Classes = () => {
  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Classes</h2>
          </header>
          <section className="class-list">
            <h3>Your Classes</h3>
            <ListClasses />
          </section>
          <section className="new-class">
            <h3>Create a new class</h3>
            <Card className="class-card">
              <CardHeader>
                <CardTitle>Import a CSV file containing the student names and their student IDs in your class.</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link to="/new-class" className="btn">
                  Create Class
                </Link>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default Classes;
