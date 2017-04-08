import logger from '../logger';
import toMarkdown from 'to-markdown';
import fmt from 'fmt-obj';
import { Question, Topic, Category, Concept, Recall } from './index';
import fs from 'fs';

Topic.find({}, (err, topics) => {
	const Topics = {};
	topics = topics.filter(t => t.name !== "Neonate/Perinatology" && t.name !== "Physical Medicine/Rehab");
	topics.forEach(t => {
		Topics[t._id] = t.name;
	});
	// logger.debug(Topics);
	Concept.find({}, (err, concepts) => {
		const Concepts = {};
		concepts.forEach(c => {
			Concepts[c._id] = c.name;
		});
		// logger.debug(Concepts);
		Category.find({}, (err, categories) => {
			const Categories = {};
			categories.forEach(c => {
				Categories[c._id] = c.name;
			});
			Question.find({}).sort('topic').exec((err, questions) => {
				const Questions = questions.map(q => {
					const category = q.category.map(c => Categories[c]);
					const concept = Concepts[q.concept] || null;
					const question = toMarkdown(q.question);
					const explanation = toMarkdown(q.explanation);
					const obj = {
						_id: q._id,
						question,
						explanation,
						topic: Topics[q.topic],
						category,
						choices: q.choices
					};
					if (concept) {
						obj.concept = concept;
					}
					return obj;
				});

				topics.forEach(t => {
					const filename = `backups/questions/${t.name}.md`;
					const filtered = Questions.filter(q => q.topic === t.name);
					filtered.forEach(obj => {
						fs.writeFile(filename, '', function(err) {
							if (err) throw err;
							fs.appendFileSync(filename, "###_id\n" + obj._id + "\n###Topic\n" + obj.topic + "\n###Category", 'utf8');
							obj.category.forEach(c => fs.appendFileSync(filename, "\n" + c, 'utf8'));
							if (obj.concept) {
								fs.appendFileSync(filename, "\n###Concept\n" + `${obj.concept}`, 'utf8');
							}
							fs.appendFileSync(filename, "\n###Question\n" + `${obj.question}`, 'utf8');
							const write =
`###Answer (${obj.choices[0].votes})
${obj.choices[0].name}
###Choice (${obj.choices[1].votes})
${obj.choices[1].name}
###Choice (${obj.choices[2].votes})
${obj.choices[2].name}
###Choice (${obj.choices[3].votes})
${obj.choices[3].name}
###Choice (${obj.choices[4].votes})
${obj.choices[4].name}`;
							fs.appendFileSync(filename, "\n"+write, 'utf8');
							fs.appendFileSync(filename, "\n###Explanation\n" + `${obj.explanation}` + "\n", 'utf8');
						});
					});
				});
			});
		});
	});
});
