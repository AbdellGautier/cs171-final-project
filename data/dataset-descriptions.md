# Dataset Descriptions

We have two datasets, the `Austin_Animal_Center_Intakes.csv` and the
`Austin_Animal_Center_Outcomes.csv`. While we have other CSV files in our
project directory, these CSVs are pre-processed versions of both datasets
to speed up our visualization rendering. We describe both datasets below.

Both of these datasets are related using the Animal ID field, which is
common in both and describes the same animal.

## Austin Animal Center Intakes

This dataset has the following fields:

- Animal ID (string)
  - Unique ID for the animal being found 
- DateTime (string)
  - Date and time the animal was found
- MonthYear (string)
  - Month and year the animal was found
- Found Location (string)
  - String describing the address where the animal was found
- Intake Type (string)
  - Description of the type of intake (e.g., stray)
- Intake Condition (string)
  - Description of the animal state when found
- Animal Type (string)
  - Type of animal (e.g., dog, cat)
- Sex upon Intake (string)
  - Sex of animal when found
- Age upon Intake (string)
  - Age of animal when found
- Breed (string)
  - Animal breed
- Color (string)
  - Animal color

We added the following fields to this dataset:
- Latitude (numeric)
  - Latitude of the "Found Location" converted using google APIs
- Longitude <numeric>
  - Longitude of the "Found Location" converted using google APIs

## Austin Animal Center Outcomes

This dataset has the following fields:

- Animal ID (string)
    - Unique ID for the animal
- Name (string)
    - What the animal was named
- DateTime
  - Date and time the animal had an outcome
- MonthYear (string)
  - Month and year the animal had an outcome
- Date of Birth
  - Birthday of the animal
- Outcome Type (string)
    - Description of the type of outcome (e.g., adoption)
- Outcome Subtype (string)
    - Additional description of the type of outcome
    - Empty for most rows
- Animal Type (string)
    - Type of animal (e.g., dog, cat)
- Sex upon Outcome (string)
    - Sex of animal when found
- Age upon Outcome (string)
    - Age of animal when found
- Breed (string)
    - Animal breed
- Color (string)
    - Animal color
