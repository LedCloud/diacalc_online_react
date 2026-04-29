import React, {useState} from "react";
import InputTwoLines from "@/Components/InputTwoLines.jsx";
import InputOneLine from "@/Components/InputOneLine.jsx";


export default function BMICorrection() {
    const [weight, setWeight] = useState('60');
    const [height, setHeight] = useState('170');
    const [age, setAge] = useState('40');
    const [targetWeight, setTargetWeight] = useState('60');
    const [period, setPeriod] = useState('12');
    const [sex, setSex] = useState('male');
    const [steps, setSteps] = useState('7000');

    const calcBmi = () => {
        const parsedW = parseFloat(weight);
        const parsedH = parseFloat(height);
        if (isNaN(parsedW) || isNaN(parsedH)) {
            return '---';
        }
        return (10000 * parsedW /( parsedH * parsedH)).toFixed(1);
    };
    const bmi = calcBmi();

    const stepsToActivity = () => {
        const parsed = parseFloat(steps);
        if (isNaN(parsed))
            return 0;
        return  (+steps - 5000)/400 + 110;
    }
    const calculateActivityType = () => {
        const intv = +steps;
        if (isNaN(intv))
            return;
        if (intv > 25000) {
            return 'Экстремальная';
        } else if (intv > 15000) {
            return 'Высокая';
        } else if (intv > 7000) {
            return 'Средняя';
        } else if (intv > 5000) {
            return 'Лёгкая';
        }
        return 'Сидячая';
    };

    const activity_type = calculateActivityType();

    const calcCalorsNeeded = ({weight, height, age, male, activity}) => {
        if (male){
            var s = 5;
        }else{
            s = -161;
        }
        const basal = 9.99 * weight + 6.25 * height - 4.92 * age + s;
        return (basal * activity / 100).toFixed(0);
    }

    const getCalor2Loose = (weight, targetWeight) => {
        const weightChange = +weight - +targetWeight;

        if (weightChange >= 0){
            return weightChange * 7716;
        }

        return weightChange * 11023;
    }

    function * genMonths(min){
        let index = min;
        while (index < 24) {
            index++;
            yield index;
        }
    }
    const calculateCalories = () => {
        //var steps = 5000+2000*(val-110)/5;
        //(steps - 5000)/400 = val - 110;
        //(steps - 5000)/400 + 110 = val <= for 7000 we get 115
        const config = {weight: weight, height: height, age: age, male: sex === 'male', activity: stepsToActivity()};

        console.log('Config', config);

        const caloryCurrent = calcCalorsNeeded(config);
        config.weight = targetWeight;
        let caloryTarget = calcCalorsNeeded(config);
        console.log(caloryCurrent, caloryTarget);
        //do no allow to starve
        if (caloryTarget <= 1200) {
            caloryTarget = 1201;
        }
        const caloryToLoose = getCalor2Loose(weight, targetWeight);
        let minMonths;
        if (caloryToLoose > 0){//loose weight
            minMonths = Math.ceil(caloryToLoose/( (caloryTarget - 1200) * 30 ));
        } else {
            //gain weight
            let addon = 0;
            if (caloryTarget < 5500){
                addon = 5500 - caloryTarget;
                minMonths = Math.ceil(-caloryToLoose/(addon*30));
            }
            else{
                minMonths = 0;
            }
        }
        let months_range = [];

        let currentSelection = +period;

        if (minMonths>24 && minMonths!==0){
            //create an only one option
            months_range.push(minMonths);
            currentSelection = minMonths;
            //setPeriods([minMonths]);
            //setPeriod(minMonths);
        } else {
            //generate months and select the nearest that was previously selected
            months_range = [...genMonths(minMonths)];
            if (!months_range.includes(currentSelection)) {
                if (currentSelection < Math.min(...months_range)) {
                    currentSelection = Math.min(...months_range);
                } else if (currentSelection > Math.max(...months_range)) {
                    currentSelection = Math.max(...months_range);
                }
            }
        }

        //Теперь можно произвести расчет калорийности для снижения.
        const caloryToGetTarget = (caloryTarget - caloryToLoose/(currentSelection * 30)).toFixed(0);

        return [caloryCurrent, caloryTarget, caloryToGetTarget, months_range, currentSelection];
    };

    const [caloryCurrent, caloryTarget, caloryToGetTarget, months_range, periodSelection] = calculateCalories();

    if (periodSelection != period) {
        setPeriod(''+ periodSelection);
    }

    const periods = months_range;

    return (
        <div className="bmi-correction__panel">
            <div className="bmi_panel">
                <div className="bmi_panel__bmi-label">ИМТ</div>
                <div className="bmi_panel__bmi-result">{bmi}</div>
                <div className="bmi_panel__weight-label">Вес кг:</div>
                <input
                    className="bmi_panel__weight-input"
                    value={weight}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setWeight(e.target.value)}/>
                <div className="bmi_panel__height-label">Рост см:</div>
                <input
                    className="bmi_panel__height-input"
                    value={height}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setHeight(e.target.value)}/>

                <div className="bmi_panel__sex-label bmi_panel__height-label">Ваш пол</div>
                <div className="bmi_panel__sex-input bmi_panel__height-input">
                    <div className="sex-group__radio checkbox-group">
                        <label htmlFor="sexMale">
                            <input id="sexMale"
                                   name="sex"
                                   value="male"
                                   type="radio"
                                   checked={sex === 'male'}
                                   onChange={(e) => setSex(e.target.value)}
                            />
                            Male</label>
                    </div>
                    <div className="sex-group__radio checkbox-group">
                        <label htmlFor="sexFemale">
                            <input id="sexFemale"
                                   name="sex"
                                   value="female"
                                   type="radio"
                                   checked={sex === 'female'}
                                   onChange={(e) => setSex(e.target.value)}
                            />
                            Female</label>
                    </div>
                </div>

                <div className="bmi_panel__note">Внимание! ИМТ рассчитанный у детей (до 18
                    лет), должен интерпретироваться специальным образом!
                    Подробнее <a href="https://diacalc.ru/BMIchildren.html">тут</a></div>
            </div>
            <div className="target_panel">
                <InputOneLine value={age}
                              onChange={setAge}
                              onBlur={setAge}
                              label="Возраст"
                              className="target_panel__age-input"
                />
                <InputOneLine
                    value={targetWeight}
                    onChange={setTargetWeight}
                    onBlur={setTargetWeight}
                    label="Целевой вес"
                    className="target_panel__weight-input"
                />
                <div className="target_panel__period">
                    <label>Период коррекции</label>
                    {/* add calculation based on age, targetWeight, sex and activity */}
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        {periods.map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="results_panel">

                <fieldset className="results_panel__activity">
                    <div>
                        <label htmlFor="activity-selector">
                            Активность: <span className="activity__type">{activity_type}</span> &bull; Количество шагов:
                            ≈<span className="activity__steps">{steps}</span>
                        </label>
                        <input id="activity-selector"
                               className="activity-selector"
                               type="range" min="5000" max="33000" step="2000" value={steps}
                               onChange={(e) => setSteps(e.target.value)}/>
                    </div>
                    <div className="results_panel__results">
                        <div className="results_panel__results__header">Норма потребления ккал/сут.</div>
                        <div className="results_panel__results__result">
                            <div>Для текущего веса</div>
                            <div>{caloryCurrent}</div>
                        </div>
                        <div className="results_panel__results__result">
                            <div>Для целевого веса</div>
                            <div>{caloryTarget}</div>
                        </div>
                        <div className="results_panel__results__result">
                            <div>Для достижения целевого веса</div>
                            <div>{caloryToGetTarget}</div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    );
}
