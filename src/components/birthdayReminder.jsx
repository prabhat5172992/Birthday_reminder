import Data from "../birthdayData.json";

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BirthdayReminder = ({ allUsers }) => {

  const sortData = (arr) => {
    return arr.sort((a, b) => a.dob.split("-")[0] - b.dob.split("-")[0]);
  };
  const currentBirthday = () => {
    const month = new Date().toLocaleDateString("en-GB").split("/")[1];
    const currentData = [...Data.data, ...allUsers];
    return currentData.filter((item) => item.dob.split("-")[1] === month);
  };
  const removePassedDate = () => {
    return currentBirthday().filter(
      (item) => item.dob.split("-")[0] >= new Date().getDate()
    );
  };

  return (
    <>
      <h1>Birthday Reminder</h1>
      {sortData(removePassedDate()).length ?
      <div className="display-activeBirthday">
        {sortData(removePassedDate()).map((item) => {
          const m = item.dob.split("-")[1];
          const d = item.dob.split("-")[0];

          return (
            <div key={item.id} className="each_person">
              <p className="birthName">{item.name}</p>
              <img
                id={item.id}
                className="profile tooltip"
                src={item.img}
                alt="profile pic"
                title={`${d} ${month[m - 1]}`}
              />
              <p className="birthDate">{`${d} ${month[m - 1]}`}</p>
            </div>
          );
        })}
      </div> : <p>No birthday found!</p>}
    </>
  );
};

export default BirthdayReminder;
