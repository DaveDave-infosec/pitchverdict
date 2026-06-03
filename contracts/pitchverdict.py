# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json
import hashlib


class PitchVerdict(gl.Contract):
    result_counter: u256
    pitch_blobs: TreeMap[str, str]
    submitter_index: TreeMap[str, str]

    def __init__(self):
        self.result_counter = u256(0)

    @gl.public.write
    def evaluate_pitch(
        self,
        startup_name: str,
        stage: str,
        industry: str,
        problem: str,
        solution: str,
        market: str,
        business_model: str,
        traction: str,
        team: str,
        competition: str,
        moat: str,
        ask: str,
    ) -> str:
        submitter_str = str(gl.message.sender_address).lower()
        counter_now = int(self.result_counter)

        pitch_text = (
            "STARTUP: " + startup_name + "\n"
            + "STAGE: " + stage + "\n"
            + "INDUSTRY: " + industry + "\n\n"
            + "PROBLEM:\n" + problem + "\n\n"
            + "SOLUTION:\n" + solution + "\n\n"
            + "MARKET:\n" + market + "\n\n"
            + "BUSINESS MODEL:\n" + business_model + "\n\n"
            + "TRACTION:\n" + traction + "\n\n"
            + "TEAM:\n" + team + "\n\n"
            + "COMPETITION:\n" + competition + "\n\n"
            + "MOAT:\n" + moat + "\n\n"
            + "ASK:\n" + ask
        )
        if len(pitch_text) > 5000:
            pitch_text = pitch_text[:5000]

        prompt = """You are a panel of six seed-stage venture investor personas evaluating a startup pitch. Each persona independently analyzes the pitch through a distinct lens, then collectively reaches a consensus verdict.

SIX LENSES:
1. Problem Validator - asks if the pain is real. Looks for: acute pain, urgency, willingness to pay.
2. Market Analyst - challenges every TAM claim. Looks for: bottom-up sizing, clear beachhead, honest market math.
3. Technical Skeptic - doubts the build is feasible. Looks for: achievable architecture, real technical depth.
4. Execution Realist - bets on the team. Looks for: domain expertise, prior execution, founder-market fit.
5. Devil's Advocate - names every failure mode. Looks for: regulatory risk, incumbents, unit economics, dependencies.
6. Momentum Tracker - wants proof markets care. Looks for: traction, retention, real demand evidence.

Return ONLY a JSON object with this exact schema:
{
  "overall_verdict": one of "Strong Pass" | "Conditional Interest" | "Needs Work" | "Hard Pass" | "Too Early to Tell",
  "overall_investability": integer 0-100,
  "confidence_level": one of "High" | "Moderate" | "Low" | "Contested",
  "funding_stage_fit": short string like "Seed ready" or "Pre-seed only" or "Series A track",
  "problem_validity": integer 0-100,
  "solution_credibility": integer 0-100,
  "market_realism": integer 0-100,
  "business_model_strength": integer 0-100,
  "traction_signal": integer 0-100,
  "team_conviction": integer 0-100,
  "competitive_positioning": integer 0-100,
  "moat_potential": integer 0-100,
  "lens_verdicts": {
    "problem_validator": "1-2 sentence verdict on pain validity",
    "market_analyst": "1-2 sentence verdict on market sizing",
    "technical_skeptic": "1-2 sentence verdict on technical feasibility",
    "execution_realist": "1-2 sentence verdict on team and execution",
    "devils_advocate": "1-2 sentence verdict on risks and failure modes",
    "momentum_tracker": "1-2 sentence verdict on demand evidence"
  },
  "key_strengths": array of 3-5 short strings, each 10-20 words, referencing specific evidence from the pitch,
  "key_concerns": array of 3-5 short strings, each 10-20 words, referencing specific evidence from the pitch,
  "one_thing_to_fix": single sentence 15-25 words of highest-leverage actionable advice,
  "investor_question": single sentence 15-25 words, the sharpest question partners would ask in the room,
  "disagreement_insight": 2-3 sentence narrative explaining where the lenses disagreed and why, OR a single sentence noting alignment if there was no significant disagreement
}

Set confidence_level to "Contested" if the lens verdicts pull in fundamentally different directions on overall_verdict or overall_investability.

This is a founder testing their pitch before real investors. Soft feedback wastes their time. Be sharp, specific, and honest. Reference evidence from the pitch text.

Return ONLY the JSON. No commentary, no markdown fences."""

        principle = (
            "The six lens verdicts should reach reasonable agreement on overall_verdict and overall_investability "
            "(differences of one verdict tier or 15 score points are acceptable). Dimension scores can vary up to 20 points across validators. "
            "Each lens_verdict must directly address what that lens looks for. key_strengths and key_concerns must reference specific evidence from the pitch text. "
            "one_thing_to_fix and investor_question must be sharp, specific, and actionable - not generic. "
            "disagreement_insight must name specific lenses and explain the substantive reason for the split when confidence is Contested or Low."
        )

        # >>> THE FIX: wrap exec_prompt result in json.dumps so the callable returns a STRING, not a dict.
        def call_validators():
            full_prompt = prompt + "\n\n--- PITCH ---\n\n" + pitch_text
            res = gl.nondet.exec_prompt(full_prompt, response_format="json")
            return json.dumps(res, sort_keys=True)
        # <<< END FIX

        raw = gl.eq_principle.prompt_comparative(call_validators, principle)
        result = json.loads(raw)

        def safe_int(v, default):
            try:
                return int(v)
            except (ValueError, TypeError):
                return default

        def safe_str(v, default):
            if v is None:
                return default
            return str(v)

        seed = submitter_str + ":" + str(counter_now) + ":pitchverdict_v2"
        result_id = "p_" + hashlib.sha256(seed.encode("utf-8")).hexdigest()[:16]

        blob = {
            "result_id": result_id,
            "submitter": submitter_str,
            "startup_name": safe_str(startup_name, ""),
            "stage": safe_str(stage, ""),
            "industry": safe_str(industry, ""),
            "overall_verdict": safe_str(result.get("overall_verdict"), "Conditional Interest"),
            "overall_investability": safe_int(result.get("overall_investability"), 50),
            "confidence_level": safe_str(result.get("confidence_level"), "Moderate"),
            "funding_stage_fit": safe_str(result.get("funding_stage_fit"), "Seed ready"),
            "problem_validity": safe_int(result.get("problem_validity"), 50),
            "solution_credibility": safe_int(result.get("solution_credibility"), 50),
            "market_realism": safe_int(result.get("market_realism"), 50),
            "business_model_strength": safe_int(result.get("business_model_strength"), 50),
            "traction_signal": safe_int(result.get("traction_signal"), 50),
            "team_conviction": safe_int(result.get("team_conviction"), 50),
            "competitive_positioning": safe_int(result.get("competitive_positioning"), 50),
            "moat_potential": safe_int(result.get("moat_potential"), 50),
            "lens_verdicts": result.get("lens_verdicts", {}),
            "key_strengths": result.get("key_strengths", []),
            "key_concerns": result.get("key_concerns", []),
            "one_thing_to_fix": safe_str(result.get("one_thing_to_fix"), ""),
            "investor_question": safe_str(result.get("investor_question"), ""),
            "disagreement_insight": safe_str(result.get("disagreement_insight"), ""),
            "pitch_preview": pitch_text[:150],
        }

        self.pitch_blobs[result_id] = json.dumps(blob)

        existing_raw = ""
        if submitter_str in self.submitter_index:
            existing_raw = self.submitter_index[submitter_str]

        if existing_raw:
            ids_list = json.loads(existing_raw)
            ids_list.append(result_id)
        else:
            ids_list = [result_id]

        self.submitter_index[submitter_str] = json.dumps(ids_list)

        self.result_counter = u256(counter_now + 1)

        return result_id

    @gl.public.view
    def get_result(self, result_id: str) -> dict:
        if result_id not in self.pitch_blobs:
            return {}
        return json.loads(self.pitch_blobs[result_id])

    @gl.public.view
    def get_results_by_submitter(self, submitter: str) -> list:
        submitter_lower = submitter.lower()
        if submitter_lower not in self.submitter_index:
            return []
        ids_raw = self.submitter_index[submitter_lower]
        ids = json.loads(ids_raw)
        results = []
        i = len(ids) - 1
        while i >= 0:
            rid = ids[i]
            if rid in self.pitch_blobs:
                results.append(json.loads(self.pitch_blobs[rid]))
            i = i - 1
        return results

    @gl.public.view
    def get_result_count(self) -> u256:
        return self.result_counter