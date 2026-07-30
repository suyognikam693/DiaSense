const IMMUTABLE_FACTORS = new Set([
  'Age',
  'Sex',
  'Education',
  'Income',
  'FamilyDiabetes',
  'Stroke',
  'HeartDiseaseorAttack',
]);

const RECOMMENDATION_LIBRARY = {
  HighBP: {
    iconKey: 'Heart',
    title: 'Reduce salt and sodium intake',
    description: 'Lower salt, avoid packaged foods, and use herbs or spices for flavoring. This can help reduce blood pressure and lower diabetes risk.',
    priority: 'high',
  },
  HighChol: {
    iconKey: 'Heart',
    title: 'Cut down on saturated fats',
    description: 'Limit deep-fried foods, ghee, butter, and full-fat dairy. Choose grilled, steamed, or baked meals and healthier oils in moderation.',
    priority: 'high',
  },
  BMI: {
    iconKey: 'Activity',
    title: 'Focus on gradual weight management',
    description: 'Even a small reduction in body weight can improve insulin sensitivity. Pair portion control with regular movement and balanced meals.',
    priority: 'high',
  },
  Smoker: {
    iconKey: 'Cigarette',
    title: 'Quit smoking',
    description: 'Smoking raises cardiovascular and diabetes risk. A quit plan, support group, or nicotine replacement therapy can help.',
    priority: 'high',
  },
  PhysActivity: {
    iconKey: 'Activity',
    title: 'Increase physical activity',
    description: 'Aim for at least 150 minutes of moderate activity each week. Walking, cycling, and simple home workouts all help improve insulin sensitivity.',
    priority: 'high',
  },
  Fruits: {
    iconKey: 'Apple',
    title: 'Add more whole fruits',
    description: 'Choose whole fruits instead of juice or sweets. Fruit with fiber helps control appetite and supports better glucose control.',
    priority: 'medium',
  },
  Veggies: {
    iconKey: 'Salad',
    title: 'Increase vegetable intake',
    description: 'Build meals around vegetables, especially non-starchy options. More fiber and micronutrients can support steadier blood sugar.',
    priority: 'medium',
  },
  HvyAlcoholConsump: {
    iconKey: 'Heart',
    title: 'Reduce heavy alcohol use',
    description: 'Cut back on alcohol, especially binge drinking. Lower alcohol intake can help with weight, blood sugar, and blood pressure control.',
    priority: 'medium',
  },
  AnyHealthcare: {
    iconKey: 'Stethoscope',
    title: 'Keep regular preventive checkups',
    description: 'Use healthcare access for routine screening and follow-up visits so risk factors can be managed early.',
    priority: 'medium',
  },
  NoDocbcCost: {
    iconKey: 'DollarSign',
    title: 'Plan for affordable care access',
    description: 'Look for low-cost clinics, community programs, or preventive care options so cost does not delay care.',
    priority: 'medium',
  },
  GenHlth: {
    iconKey: 'Heart',
    title: 'Improve overall health habits',
    description: 'Use a mix of sleep, diet, activity, and stress management to improve general health over time.',
    priority: 'medium',
  },
  MentHlth: {
    iconKey: 'Brain',
    title: 'Manage stress and mental health',
    description: 'Daily stress reduction, sleep routines, and support from a professional can improve both mental and metabolic health.',
    priority: 'medium',
  },
  PhysHlth: {
    iconKey: 'Heart',
    title: 'Address physical limitations',
    description: 'If pain or illness is limiting activity, speak with a clinician and build a safe movement plan you can maintain.',
    priority: 'medium',
  },
  DiffWalk: {
    iconKey: 'Activity',
    title: 'Work on mobility and daily movement',
    description: 'Gentle walking, mobility work, and physical therapy can help improve activity levels and reduce sedentary time.',
    priority: 'medium',
  },
  CholCheck: {
    iconKey: 'Stethoscope',
    title: 'Stay on top of screening',
    description: 'Keep routine blood pressure, cholesterol, and glucose checks current so risk changes are caught early.',
    priority: 'medium',
  },
};

export function getActionableRiskFactors(topFactors = []) {
  return topFactors
    .filter((factor) => {
      const contribution = Number(factor?.contribution ?? 0);
      return contribution > 0 && !IMMUTABLE_FACTORS.has(factor?.feature);
    })
    .map((factor) => ({
      ...factor,
      contribution: Number(factor?.contribution ?? 0),
      magnitude: Number(factor?.magnitude ?? Math.abs(Number(factor?.contribution ?? 0))),
    }))
    .filter((factor) => Boolean(RECOMMENDATION_LIBRARY[factor.feature]))
    .sort((a, b) => b.magnitude - a.magnitude);
}

export function buildRiskRecommendations(topFactors = []) {
  return getActionableRiskFactors(topFactors).map((factor) => ({
    feature: factor.feature,
    contribution: factor.contribution,
    magnitude: factor.magnitude,
    ...RECOMMENDATION_LIBRARY[factor.feature],
  }));
}
